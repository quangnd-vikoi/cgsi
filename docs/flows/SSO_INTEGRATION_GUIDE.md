# SSO Integration Guide

## Overview

This guide provides a step-by-step flow for integrating the SSO (Single Sign-On) authentication system with the CGSI Client Portal.

**Base URL:** `https://stgitrade.cgsi.com.sg/portal/`

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant OldPortal
    participant NewPortal
    participant SSOApi
    participant TargetAPI

    User->>OldPortal: 1. Login + 2FA
    OldPortal->>NewPortal: 2. Redirect with code
    NewPortal->>SSOApi: 3. Exchange code for tokens
    SSOApi->>NewPortal: Return access & refresh tokens
    NewPortal->>TargetAPI: 4. Call API with access token
    TargetAPI->>NewPortal: Return data
    NewPortal->>SSOApi: 5. Refresh token (when expired)
    SSOApi->>NewPortal: Return new tokens
```

---

## Prerequisites

### Test Credentials
- **Login URL:** https://stgitrade.cgsi.com.sg/app/user.login.z
- **Test User ID:** `GRACE6388`
- **Password:** `Cgs#1234`
- **Logout URL:** https://stgitrade.cgsi.com.sg/app/logout.z

### Client Configuration
- **Client ID:** `itrade`
- **Redirect URI:** Configure based on your environment (e.g., `http://localhost:8080/authorize`)

---

## Step-by-Step Integration

### Step 1: User Login with 2FA

1. Direct user to the login portal: `https://stgitrade.cgsi.com.sg/app/user.login.z`
2. User completes login and 2FA verification
3. System redirects to new portal

![Login Flow](screenshot-login.png)

---

### Step 2: Capture Authorization Code

After successful authentication, the user is redirected to the new portal with an authorization code in the URL.

**Sample Redirect URL:**
```
https://stgitrade.cgsi.com.sg/portal/?code=a0daf83a6ecb545d538ea9b3dc706614f73ee2fe1c0401164ec30bae934cc906&timestamp=1765766540&state=6546757c-ff0a-435d-940c-4bf82d1b2e94
```

**URL Parameters:**
| Parameter | Description | Example |
|-----------|-------------|---------|
| `code` | Authorization code | `a0daf83a6ecb545d...` |
| `timestamp` | Unix timestamp | `1765766540` |
| `state` | CSRF protection token | `6546757c-ff0a-435d...` |

**Implementation:**
```typescript
// Extract code from URL
const urlParams = new URLSearchParams(window.location.search);
const authCode = urlParams.get('code');
const timestamp = urlParams.get('timestamp');
const state = urlParams.get('state');

if (!authCode) {
  // Handle missing authorization code
  throw new Error('Authorization code not found');
}
```

---

### Step 3: Exchange Code for Access Token

Call the SSO token endpoint to exchange the authorization code for access and refresh tokens.

**Endpoint:** `POST /sso/api/v1/token`

**Request:**
```bash
curl --location 'https://stgitrade.cgsi.com.sg/portal/sso/api/v1/token' \
--header 'Content-Type: application/json' \
--data '{
    "code": "a0daf83a6ecb545d538ea9b3dc706614f73ee2fe1c0401164ec30bae934cc906",
    "clientId": "itrade",
    "redirectUri": "http://localhost:8080/authorize"
}'
```

**Request Body:**
```typescript
interface TokenRequest {
  code: string;        // Authorization code from Step 2
  clientId: string;    // Client identifier (e.g., "itrade")
  redirectUri: string; // Must match registered redirect URI
}
```

**Response:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiNWI5Nzg0YjdkNzAwZTU5OWMxZjRiMzJkMTFjYTg3IiwidHlwIjoiSldUIn0...",
  "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiNWI5Nzg0YjdkNzAwZTU5OWMxZjRiMzJkMTFjYTg3IiwidHlwIjoiSldUIn0...",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "refreshToken": "21ee4d1cac11cd50e918bb4651d20ed12d1f66ed60a20cb5758322df521c34d7"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `idToken` | string | JWT identity token containing user information |
| `accessToken` | string | JWT access token for API authentication |
| `expiresIn` | number | Token expiry time in seconds (3600 = 1 hour) |
| `tokenType` | string | Always "Bearer" |
| `refreshToken` | string | Token used to obtain new access tokens |

**Implementation:**
```typescript
import { postAPI } from '@/lib/fetchWrapper';

interface TokenResponse {
  idToken: string;
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string;
}

async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const response = await postAPI<TokenResponse, TokenRequest>(
    '/sso/api/v1/token',
    {
      code,
      clientId: 'itrade',
      redirectUri: window.location.origin + '/authorize'
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to exchange code for token');
  }

  // Store tokens securely
  sessionStorage.setItem('accessToken', response.data.accessToken);
  sessionStorage.setItem('refreshToken', response.data.refreshToken);
  sessionStorage.setItem('tokenExpiry', String(Date.now() + response.data.expiresIn * 1000));

  return response.data;
}
```

---

### Step 4: Use Access Token for API Calls

Include the access token in the `Authorization` header for all API requests.

**Endpoint Example:** `GET /subscription/api/v1/product/IOP`

**Request:**
```bash
curl --location 'https://stgitrade.cgsi.com.sg/portal/subscription/api/v1/product/IOP' \
--header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiNWI5Nzg0YjdkNzAwZTU5OWMxZjRiMzJkMTFjYTg3IiwidHlwIjoiSldUIn0...'
```

**Implementation:**
```typescript
import { fetchAPI } from '@/lib/fetchWrapper';

async function fetchProtectedResource<T>(endpoint: string): Promise<T> {
  const accessToken = sessionStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('No access token available');
  }

  // Check if token is expired
  const tokenExpiry = sessionStorage.getItem('tokenExpiry');
  if (tokenExpiry && Date.now() >= parseInt(tokenExpiry)) {
    // Token expired, refresh it first
    await refreshAccessToken();
  }

  const response = await fetch(`https://stgitrade.cgsi.com.sg/portal${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - try refreshing token
      await refreshAccessToken();
      // Retry the request
      return fetchProtectedResource<T>(endpoint);
    }
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

---

### Step 5: Refresh Token When Expired

When the access token expires (after 3600 seconds / 1 hour), use the refresh token to obtain a new access token.

**Endpoint:** `POST /sso/api/v1/token/refresh`

**Request:**
```bash
curl --location 'https://stgitrade.cgsi.com.sg/portal/sso/api/v1/token/refresh' \
--header 'Content-Type: application/json' \
--data '{
    "refreshToken": "21ee4d1cac11cd50e918bb4651d20ed12d1f66ed60a20cb5758322df521c34d7",
    "clientId": "itrade"
}'
```

**Request Body:**
```typescript
interface RefreshTokenRequest {
  refreshToken: string; // Refresh token from Step 3
  clientId: string;     // Client identifier (e.g., "itrade")
}
```

**Response:**
Same format as Step 3 response - returns new `accessToken`, `refreshToken`, and `expiresIn`.

**Implementation:**
```typescript
async function refreshAccessToken(): Promise<TokenResponse> {
  const refreshToken = sessionStorage.getItem('refreshToken');

  if (!refreshToken) {
    // No refresh token - redirect to login
    window.location.href = 'https://stgitrade.cgsi.com.sg/app/user.login.z';
    throw new Error('No refresh token available');
  }

  const response = await postAPI<TokenResponse, RefreshTokenRequest>(
    '/sso/api/v1/token/refresh',
    {
      refreshToken,
      clientId: 'itrade'
    }
  );

  if (!response.success || !response.data) {
    // Refresh failed - redirect to login
    sessionStorage.clear();
    window.location.href = 'https://stgitrade.cgsi.com.sg/app/user.login.z';
    throw new Error(response.error || 'Failed to refresh token');
  }

  // Update stored tokens
  sessionStorage.setItem('accessToken', response.data.accessToken);
  sessionStorage.setItem('refreshToken', response.data.refreshToken);
  sessionStorage.setItem('tokenExpiry', String(Date.now() + response.data.expiresIn * 1000));

  return response.data;
}
```

---

## API Endpoints Reference

### Base URL
```
https://stgitrade.cgsi.com.sg/portal/
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sso/api/v1/token` | Exchange authorization code for tokens |
| POST | `/sso/api/v1/token/refresh` | Refresh expired access token |

### Legacy Portal Endpoints

| Endpoint | Description |
|----------|-------------|
| `https://stgitrade.cgsi.com.sg/app/user.login.z` | Login page |
| `https://stgitrade.cgsi.com.sg/app/logout.z` | Logout |

---

## Token Management Best Practices

### Storage
- **Session Storage:** Recommended for access tokens (cleared when tab closes)
- **Never use localStorage** for sensitive tokens in production
- Consider using httpOnly cookies for enhanced security

### Expiry Handling
```typescript
// Check token expiry before each API call
function isTokenExpired(): boolean {
  const expiry = sessionStorage.getItem('tokenExpiry');
  return expiry ? Date.now() >= parseInt(expiry) : true;
}

// Proactively refresh token 5 minutes before expiry
function shouldRefreshToken(): boolean {
  const expiry = sessionStorage.getItem('tokenExpiry');
  if (!expiry) return true;

  const expiryTime = parseInt(expiry);
  const fiveMinutes = 5 * 60 * 1000;
  return Date.now() >= (expiryTime - fiveMinutes);
}
```

### Security Considerations
1. Always validate the `state` parameter to prevent CSRF attacks
2. Use HTTPS for all API communications
3. Clear tokens on logout
4. Implement token rotation on refresh
5. Handle 401 responses gracefully

---

## Complete Implementation Example

### Auth Utility Service

Create a centralized auth service: `lib/authService.ts`

```typescript
import { postAPI } from '@/lib/fetchWrapper';

interface TokenResponse {
  idToken: string;
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_KEY = 'refreshToken';
  private readonly EXPIRY_KEY = 'tokenExpiry';
  private readonly CLIENT_ID = 'itrade';

  async exchangeCode(code: string, redirectUri: string): Promise<void> {
    const response = await postAPI<TokenResponse, any>(
      '/sso/api/v1/token',
      {
        code,
        clientId: this.CLIENT_ID,
        redirectUri
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to exchange code');
    }

    this.storeTokens(response.data);
  }

  async refreshToken(): Promise<void> {
    const refreshToken = sessionStorage.getItem(this.REFRESH_KEY);

    if (!refreshToken) {
      this.redirectToLogin();
      throw new Error('No refresh token');
    }

    const response = await postAPI<TokenResponse, any>(
      '/sso/api/v1/token/refresh',
      {
        refreshToken,
        clientId: this.CLIENT_ID
      }
    );

    if (!response.success || !response.data) {
      this.clearTokens();
      this.redirectToLogin();
      throw new Error(response.error || 'Failed to refresh token');
    }

    this.storeTokens(response.data);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const expiry = sessionStorage.getItem(this.EXPIRY_KEY);
    return expiry ? Date.now() >= parseInt(expiry) : true;
  }

  shouldRefreshToken(): boolean {
    const expiry = sessionStorage.getItem(this.EXPIRY_KEY);
    if (!expiry) return true;

    const expiryTime = parseInt(expiry);
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() >= (expiryTime - fiveMinutes);
  }

  private storeTokens(data: TokenResponse): void {
    sessionStorage.setItem(this.TOKEN_KEY, data.accessToken);
    sessionStorage.setItem(this.REFRESH_KEY, data.refreshToken);
    sessionStorage.setItem(this.EXPIRY_KEY, String(Date.now() + data.expiresIn * 1000));
  }

  clearTokens(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_KEY);
    sessionStorage.removeItem(this.EXPIRY_KEY);
  }

  redirectToLogin(): void {
    window.location.href = 'https://stgitrade.cgsi.com.sg/app/user.login.z';
  }

  logout(): void {
    this.clearTokens();
    window.location.href = 'https://stgitrade.cgsi.com.sg/app/logout.z';
  }
}

export const authService = new AuthService();
```

### API Interceptor

Update `lib/fetchWrapper.ts` to include auth headers:

```typescript
import { authService } from './authService';

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Check and refresh token if needed
  if (authService.shouldRefreshToken()) {
    await authService.refreshToken();
  }

  const accessToken = authService.getAccessToken();

  if (!accessToken) {
    authService.redirectToLogin();
    throw new Error('No access token');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token invalid - try refresh once
    await authService.refreshToken();

    // Retry request with new token
    const newToken = authService.getAccessToken();
    const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!retryResponse.ok) {
      throw new Error(`API error: ${retryResponse.status}`);
    }

    return retryResponse.json();
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

### Authorization Page Component

Create `app/(with-layout)/authorize/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/authService';
import { INTERNAL_ROUTES } from '@/constants/routes';

export default function AuthorizePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code) {
        setError('Authorization code not found');
        return;
      }

      // Validate state parameter (implement CSRF protection)
      const savedState = sessionStorage.getItem('oauth_state');
      if (state !== savedState) {
        setError('Invalid state parameter');
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/authorize`;
        await authService.exchangeCode(code, redirectUri);

        // Clear state
        sessionStorage.removeItem('oauth_state');

        // Redirect to home or intended page
        const intendedPath = sessionStorage.getItem('intended_path') || INTERNAL_ROUTES.HOME;
        sessionStorage.removeItem('intended_path');

        router.push(intendedPath);
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    handleAuth();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-status-error mb-4">Authentication Error</h1>
          <p className="text-typo-secondary mb-4">{error}</p>
          <button
            onClick={() => authService.redirectToLogin()}
            className="px-4 py-2 bg-cgs-blue text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cgs-blue mx-auto mb-4"></div>
        <p className="text-typo-secondary">Authenticating...</p>
      </div>
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| "Authorization code not found" | Missing code in redirect URL | Verify redirect URI configuration |
| "Invalid state parameter" | CSRF token mismatch | Implement proper state management |
| 401 Unauthorized | Expired or invalid token | Implement token refresh logic |
| Token refresh fails | Refresh token expired | Redirect user to login |
| CORS errors | Missing CORS headers | Contact backend team |

### Debug Checklist

- [ ] Verify redirect URI matches registered URI exactly
- [ ] Check authorization code is not expired (usually 10 minutes)
- [ ] Ensure clientId is correct ("itrade")
- [ ] Validate access token is included in Authorization header
- [ ] Check token expiry time calculation
- [ ] Verify refresh token is stored and accessible
- [ ] Test state parameter validation

---

## Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://stgitrade.cgsi.com.sg/portal
NEXT_PUBLIC_SSO_CLIENT_ID=itrade
NEXT_PUBLIC_OLD_PORTAL_URL=https://stgitrade.cgsi.com.sg/app
```

---

## Testing

### Manual Test Flow

1. Clear all session storage
2. Navigate to login: `https://stgitrade.cgsi.com.sg/app/user.login.z`
3. Login with test credentials: `GRACE6388` / `Cgs#1234`
4. Complete 2FA
5. Verify redirect with authorization code
6. Check token exchange in Network tab
7. Test API call with access token
8. Wait for token expiry and test refresh
9. Test logout flow

### Test Credentials

- **User ID:** GRACE6388
- **Password:** Cgs#1234
- **Environment:** Staging

---

## Next Steps

1. Implement `authService` in `lib/authService.ts`
2. Update `fetchWrapper.ts` with auth interceptor
3. Create `/authorize` callback page
4. Add token refresh logic to API calls
5. Implement logout functionality
6. Add error handling for auth failures
7. Test complete flow end-to-end

---

## Additional Resources

- [JWT Decoder](https://jwt.io/) - Decode and inspect JWT tokens
- [OAuth 2.0 Flow](https://oauth.net/2/) - Understanding OAuth flows
- CGSI API Documentation - Contact backend team for detailed API specs
