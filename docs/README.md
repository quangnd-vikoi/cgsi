# CGSI iTrade Portal - Documentation

Complete documentation for the CGSI iTrade Portal project, organized for easy navigation and maintenance.

## 📁 Documentation Structure

```
docs/
├── flows/              # Implementation guides & step-by-step flows
├── rules/              # Checklists, references & specifications
└── swagger/            # API specifications (OpenAPI/Swagger)
    ├── api-doc-v1/     # Version 1 API specs
    └── api-doc-v2/     # Version 2 API specs (latest)
```

## 🗂️ Folder Guide

### 📖 `flows/` - Implementation Flow Documentation

**Purpose:** Step-by-step guides for implementing features

**Contains:**
- API integration guides with code examples
- SSO authentication implementation
- Feature-specific implementation plans
- V2 API migration guides

**Use when:** You need to implement a new feature or integrate an API

[→ View flows documentation](./flows/README.md)

---

### 📋 `rules/` - Reference & Rules Documentation

**Purpose:** Quick-reference materials and checklists

**Contains:**
- Complete API endpoint catalog
- Implementation status checklists
- Component inventory
- Postman testing collection

**Use when:** You need quick reference or want to check implementation status

[→ View rules documentation](./rules/README.md)

---

### 📜 `swagger/` - API Specifications

**Purpose:** OpenAPI/Swagger specifications for all APIs

**Structure:**
- `api-doc-v1/` - Legacy v1 specifications (YAML format)
- `api-doc-v2/` - Current v2 specifications (JSON format) ⭐

**Contains:**
- Profile API specs
- Subscription API specs
- Notification API specs
- External SSO API specs
- SSO (Auth) API specs

**Use when:** You need the official API contract or request/response schemas

---

## 🚀 Quick Start

### For New Developers

1. **Understand the architecture** → Read `flows/API-INTEGRATION-GUIDE.md`
2. **Check component inventory** → See `rules/COMPONENTS.md`
3. **View API endpoints** → Browse `rules/API-Complete-List.md`

### For Feature Implementation

1. **Check if guide exists** → Look in `flows/` folder
2. **Review API specs** → Check `swagger/api-doc-v2/`
3. **Follow patterns** → Use `flows/API-INTEGRATION-GUIDE.md`
4. **Test endpoints** → Import `rules/CGSI_iTrade_Portal_APIs.postman_collection.json`

### For SSO Integration

1. **Read the guide** → `flows/SSO_INTEGRATION_GUIDE.md`
2. **Track progress** → `rules/sso-implementation-plan.md`
3. **Test endpoints** → Use Postman collection

---

## 📊 Documentation Index

### Implementation Guides (flows/)
| Guide | Purpose | Status |
|-------|---------|--------|
| API-INTEGRATION-GUIDE.md | Master API integration patterns | ✅ Complete |
| SSO_INTEGRATION_GUIDE.md | SSO authentication flow | ✅ Complete |
| profile-api-implementation-plan.md | Profile API integration | 📝 In Progress |
| portfolio-api-implementation-plan.md | Portfolio API integration | ❌ Not Started |
| notification-implementation.md | Notification system | 🟢 85% Complete |
| MySubscription-API-Integration-Plan.md | Subscription feature | ✅ Complete |
| IMPLEMENTATION_PLAN_V2_APIs.md | V2 API migration | 📝 Ready |

### References (rules/)
| Document | Purpose |
|----------|---------|
| API-Complete-List.md | Complete API endpoint catalog |
| API_READINESS_CHECKLIST.md | Quick implementation status |
| sso-implementation-plan.md | SSO task checklist |
| COMPONENTS.md | UI component inventory |
| CGSI_iTrade_Portal_APIs.postman_collection.json | API testing collection |

### API Specifications (swagger/)
| API Domain | v1 Spec | v2 Spec |
|------------|---------|---------|
| Profile | iTrade-ProfileAPI.yaml | profile-api-0.0.1-snapshot.json |
| Subscription | ITrade-SubscriptionAPI.yaml | subscription-api-0.0.1-snapshot.json |
| Notification | iTrade-NotificationAPI.yaml | notification-api-0.0.1-snapshot.json |
| External SSO | iTrade-ExternalSSOAPI.yaml | externalsso-api-0.0.1-snapshot.json |
| SSO (Auth) | iTrade-SSOAPI.yaml | sso-api-0.0.1-snapshot.json |

---

## 🔍 Finding Documentation

### By Task

**"I need to implement SSO"**
→ `flows/SSO_INTEGRATION_GUIDE.md`

**"I want to add a new API endpoint"**
→ `flows/API-INTEGRATION-GUIDE.md`

**"Which APIs are ready to use?"**
→ `rules/API_READINESS_CHECKLIST.md`

**"What components exist in the app?"**
→ `rules/COMPONENTS.md`

**"What's the exact API request/response format?"**
→ `swagger/api-doc-v2/*.json`

### By Domain

| Domain | Flow Guide | Reference | API Spec |
|--------|-----------|-----------|----------|
| **Auth/SSO** | flows/SSO_INTEGRATION_GUIDE.md | rules/sso-implementation-plan.md | swagger/api-doc-v2/sso-api-*.json |
| **Profile** | flows/profile-api-implementation-plan.md | rules/API-Complete-List.md | swagger/api-doc-v2/profile-api-*.json |
| **Subscription** | flows/MySubscription-API-Integration-Plan.md | rules/API-Complete-List.md | swagger/api-doc-v2/subscription-api-*.json |
| **Notification** | flows/notification-implementation.md | rules/API-Complete-List.md | swagger/api-doc-v2/notification-api-*.json |

---

## 🎯 Best Practices

1. **Always check v2 specs first** - They're the latest and most accurate
2. **Use implementation guides** - Don't reinvent patterns that already exist
3. **Update checklists** - Mark tasks as complete when done
4. **Cross-reference** - Guides reference checklists, checklists reference guides
5. **Test with Postman** - Use the provided collection for API validation

---

## 📝 Documentation Maintenance

### Adding New Documentation

**New implementation guide?** → Add to `flows/`
**New reference/checklist?** → Add to `rules/`
**New API spec?** → Add to `swagger/api-doc-v2/`

### Updating Existing Docs

- Update both the guide and checklist
- Add version history or "Last Updated" date
- Cross-link related documents
- Update this README's index

---

## 🆘 Need Help?

- **Architecture questions?** → Read `flows/API-INTEGRATION-GUIDE.md`
- **Can't find something?** → Check the index above
- **API not working?** → Compare with `swagger/api-doc-v2/` specs
- **Documentation bug?** → Report in project issues

---

**Last Updated:** 2026-01-08
**Documentation Version:** 2.0
