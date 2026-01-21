# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Project Overview

CGSI iTrade Portal - A Next.js 15 web application for stock trading and investment management. This is a customer portal enabling users to manage portfolios, subscribe to market data, track investments, and access trading applications.

**Key Technologies:**

- Next.js 15.5 with App Router and Turbopack
- React 19 + TypeScript 5
- TailwindCSS 4 (inline theme configuration)
- Radix UI + Shadcn/ui components
- Zustand for state management

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

The app runs on `http://localhost:3000` but is deployed at the `/portal` base path (accessible at `http://localhost:3000/portal/`).

## Critical Configuration

### Base Path Configuration

The application is configured to run at `/portal` base path:

- **next.config.ts**: `basePath: "/portal"` and `assetPrefix: "/portal/"`
- All internal routes must account for this base path
- Environment variable: `NEXT_PUBLIC_BASE_PATH="/portal"`

### SVG Handling

SVGs are imported as React components via `@svgr/webpack`:

```typescript
import Logo from "@/public/logo.svg";
// Usage: <Logo />
```

Both webpack and Turbopack are configured to handle this.

### Image Optimization

Images are unoptimized (`unoptimized: true`) with remote patterns allowing `https://www.cgsi.com.sg`.

## Architecture Patterns

### Route Groups for Layouts

The app uses Next.js route groups to manage different layout contexts:

**`app/(with-layout)/`** - Full layout with Header, Footer, and SheetManager:

- Most user-facing pages (home, portfolio, discover, market-data, donations, etc.)
- Layout: `app/(with-layout)/layout.tsx`

**`app/(minimal)/`** - Minimal layout (if exists) for sidebar-based pages

- Sidebar sheets for user profile, notifications, settings

**Page-specific components** are stored in `_components/` folders next to their pages (e.g., `app/(with-layout)/portfolio/_components/`).

### State Management with Zustand

Centralized stores in `stores/`:

**`tradingAccountStore.ts`**:

- Manages multiple trading account types (Cash, Margin, Shares Borrowing, CUT, iCash)
- Pre-populated with mock data
- Methods: `setAccounts`, `setSelectedAccount`, `updateSelectedAccount`, `getAccountById`, `getDefaultAccountNo`
- **`getDefaultAccountNo()`**: Returns default account number with priority logic
  - Priority: CTA > CUT > iCash > MTA > SBL
  - If only 1 account exists, select it regardless of type
  - Returns `null` if no accounts available
  - Usage: `const accountNo = useTradingAccountStore.getState().getDefaultAccountNo()`

**`sheetStore.ts`**:

- Controls sheet/modal visibility across the app
- Methods: `setOpenSheet(type, payload?)`, `closeSheet()`
- Used in conjunction with `SheetManager` component

**`userStore.ts`**: User email and mobile information
**`selectionStore.ts`**: Selection state management

### API Integration

**Configuration** (`lib/apiConfig.ts`):

- Base URL: `https://www.cgsi.com.sg/cgsi/api/v1` (configurable via `NEXT_PUBLIC_API_URL`)
- Language constants: `LANG.EN = 1`, `LANG.CN = 2`
- Endpoint builders for announcements, notices, campaigns, events, insights

**Fetch Wrapper** (`lib/fetchWrapper.ts`):
Provides normalized API responses with consistent error handling:

```typescript
import { fetchAPI, fetchWithCache, postAPI, putAPI, deleteAPI } from "@/lib/fetchWrapper";

// GET with caching
const response = await fetchWithCache<DataType>("/endpoint", 3600);

// POST
const response = await postAPI<ResponseType, BodyType>("/endpoint", { data });

// Response format:
interface APIResponse<T> {
	success: boolean;
	data: T | null;
	error: string | null;
	statusCode: number;
}
```

**Standard API Response Format**:
The backend returns:

```typescript
{
  status: "SUCCESS" | "ERROR",
  statuscode: string,
  article?: T,  // or data?: T
  message?: string
}
```

The fetch wrapper normalizes this to `APIResponse<T>`.

### External SSO Integration

**Service Layer** (`lib/services/externalSSOService.ts`):
Handles all external SSO (Single Sign-On) integrations with 8 external systems.

```typescript
import { externalSSOService } from "@/lib/services/externalSSOService";
// or use legacy import:
import { redirectToNTP, redirectToEW8 } from "@/lib/services/ssoService";

// Available SSO methods (one-liner redirects):
await externalSSOService.redirectToNTP(); // Next Trading Platform
await externalSSOService.redirectToResearch(); // Research Portal
await externalSSOService.redirectToStockFilter(); // Stock Filter
await externalSSOService.redirectToCorporateAction(); // Corporate Action (SAML)
await externalSSOService.redirectToEStatement(); // eStatement
await externalSSOService.redirectToIScreener(); // iScreener (⚠️ never implemented)
await externalSSOService.redirectToEW8(); // W8 Form
await externalSSOService.redirectToECRS(); // CRS Declaration
```

**SSO Types:**

- **Simple Redirect**: Most services (Research, Stock Filter, eStatement, EW8, ECRS)
- **Form Submission**: NTP (multiple fields), Corporate Action (SAML)

**UI Integration:**

- Header "Trade Now" button → NTP SSO
- Profile sidebar "Corporate Actions" → Corporate Action SSO
- Profile sidebar "eStatements" → eStatement SSO
- Profile sidebar Trading Declarations W8-BEN "Renew" → EW8 SSO
- Profile sidebar Trading Declarations CRS "Renew" → ECRS SSO
- Discover page Stock Research cards → iScreener & Stock Filter SSO

**Documentation:** See `docs/flows/externalsso-api-implementation-plan.md`

### Routes and Navigation

**Internal routes** (`constants/routes.ts`):

- `INTERNAL_ROUTES` object for all app routes
- Example: `INTERNAL_ROUTES.PORTFOLIO = "/portfolio"`
- Account linkages with query params: `ACCOUNT_LINKAGES(type, unlink?)`

**External CGSI URLs**:

- `CGSI` object contains links to external CGSI services (campaigns, events, trade platform, invoice, etc.)
- Invoice URL builder: `CGSI.INVOICE(token)`

### Component Architecture

**Shadcn/ui Components** (`components/ui/`):
Pre-built accessible components from Radix UI (button, dialog, sheet, tabs, accordion, etc.). These follow the Shadcn/ui pattern and can be customized via Tailwind classes.

**Business Components** (`components/`):

- `Header.tsx`, `Footer.tsx` - Main layout components
- Custom components for specific features

**Class Variance Authority (CVA)**:
Use CVA for component variants with type-safe props:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
	variants: {
		variant: { default: "...", destructive: "..." },
		size: { default: "...", sm: "...", lg: "..." },
	},
});
```

### Styling System

**TailwindCSS 4** with inline theme configuration in `app/globals.css`:

- Custom breakpoint: `xs: 375px`
- Theme uses CSS variables defined in `:root` and `.dark`
- Custom color system:
    - Typography: `typo-primary`, `typo-secondary`, `typo-tertiary`
    - CGS blue: `cgs-blue` (#003A8C)
    - Status colors: `status-error`, `status-success`, `status-warning`, `status-selected`
    - Theme colors: `theme-blue-*`, `theme-neutral-*`
    - Tone colors: `tone-green-*`, `tone-orange-*`, `tone-blue-*`, `tone-red-*`

**Custom Utilities**:

- `.container-default`: Responsive container (mx-4 md:mx-6 xl:max-w-1320px)
- `.pad`: Responsive padding (p-4 md:p-6)
- `.pad-x`: Responsive horizontal padding
- `.investment-card`: Gradient card with border
- `.sidebar-scroll`: Custom scrollbar styling
- `.scrollbar-offset-right`, `.scrollbar-offset-laptop`: Mobile/desktop scrollbar offsets

**Global Styles**:

- User selection disabled by default (`user-select: none`)
- Text selection enabled for inputs, textareas, contenteditable
- Base font size: 16px

### TypeScript Configuration

- Target: ES2017
- Path alias: `@/*` maps to root directory
- Strict mode enabled
- Module resolution: bundler

## Common Patterns

### Multi-Step Forms

Market data subscription uses step-based state management:

1. Select products
2. Cart review
3. Declaration
4. Terms acceptance
5. Success confirmation

Each step manages its own state, with navigation handled by a central stepper component.

### Sheet-based Navigation

Instead of full page navigation, the app uses Radix Dialog sheets for:

- User profile
- Notifications
- Settings
- Other sidebar content

Pattern:

```typescript
const { setOpenSheet } = useSheetStore();

// Open sheet
setOpenSheet("profile", { userId: "123" });

// In SheetManager.tsx, render based on openSheet type
```

### Responsive Design

Mobile-first approach with breakpoints:

- xs: 375px (custom)
- md: 768px (Tailwind default)
- lg, xl: Standard Tailwind

Use `useMediaQuery` hook for client-side responsive logic.

### Toast Notifications

Using Sonner (`sonner` package):

- Position: bottom-right
- Configured in layout via `<Toaster position="bottom-right" />`

## Important Considerations

### Trading Account Structure

All trading accounts follow the `TradingAccount` interface with:

- Multiple account types: Cash, Margin, Shares Borrowing, CUT, iCash
- Detailed account information (CDP, Sub-CDP, CPF, SRS, payment details)
- Representative information (name, department, rep number, contact)

Currently populated with mock data in `tradingAccountStore.ts`.

### API Language Support

All API endpoints accept a language parameter:

- English: `LANG.EN = 1`
- Chinese: `LANG.CN = 2`

Default to English unless explicitly specified.

### Path Aliasing

Always use `@/` for imports:

```typescript
// Correct
import { Button } from "@/components/ui/button";
import { INTERNAL_ROUTES } from "@/constants/routes";

// Incorrect
import { Button } from "../../components/ui/button";
```

### Security Notes

- No environment variables currently defined beyond `NEXT_PUBLIC_BASE_PATH`
- API base URL defaults to production: `https://www.cgsi.com.sg/cgsi/api/v1`
- Use `NEXT_PUBLIC_API_URL` environment variable to override for development

## File Structure Reference

```
app/
├── (with-layout)/        # Pages with Header/Footer
│   ├── (home)/          # Home page
│   ├── (detail)/        # Detail pages (market-data, donations, etc.)
│   ├── (form)/          # Form pages
│   ├── discover/        # Product discovery
│   └── portfolio/       # Portfolio dashboard
├── (minimal)/           # Minimal layout pages
│   └── sidebar/         # Sidebar sheets
├── layout.tsx           # Root layout
└── globals.css          # Global styles + Tailwind config

components/
├── ui/                  # Shadcn/ui components
├── Header.tsx
└── Footer.tsx

lib/
├── apiConfig.ts         # API endpoints
└── fetchWrapper.ts      # API utilities

stores/                  # Zustand state management
├── tradingAccountStore.ts
├── sheetStore.ts
├── userStore.ts
└── selectionStore.ts

constants/
└── routes.ts            # Route definitions

types/                   # TypeScript definitions

hooks/                   # Custom React hooks

public/                  # Static assets
```
