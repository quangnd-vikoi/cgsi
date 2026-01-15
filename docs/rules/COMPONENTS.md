# Custom Components Documentation

This document provides comprehensive documentation for all custom components in the CGSI iTrade Portal application.

## Table of Contents

- [Core Components](#core-components)
- [Portfolio Components](#portfolio-components)
- [Market Data Components](#market-data-components)
- [Form & Application Components](#form--application-components)
- [Discover Page Components](#discover-page-components)
- [Donation Components](#donation-components)
- [Sidebar & Sheet Components](#sidebar--sheet-components)
- [Component Statistics](#component-statistics)

---

## Core Components

Located in `/components/` directory.

### Alert

**File**: `components/Alert.tsx`

Reusable alert/confirmation dialog wrapper built on Shadcn AlertDialog.

**Props**:
```typescript
{
  trigger?: ReactNode;          // Custom trigger element
  title: string;                // Dialog title
  description?: ReactNode;      // Dialog description/content
  cancelText?: string;          // Cancel button text (default: "Cancel")
  actionText?: string;          // Action button text (default: "Continue")
  onAction?: () => void;        // Action button callback
  onCancel?: () => void;        // Cancel button callback
  open?: boolean;               // Controlled open state
  onOpenChange?: (open: boolean) => void;
  className?: string;           // Custom styling
}
```

**Features**:
- Customizable trigger element
- Scrollable description content
- Styled action buttons
- Controlled or uncontrolled mode

**Usage**:
```typescript
<Alert
  trigger={<Button>Delete Item</Button>}
  title="Are you sure?"
  description="This action cannot be undone."
  actionText="Delete"
  onAction={() => handleDelete()}
/>
```

---

### CircleAlertIcon

**File**: `components/CircleAlertIcon.tsx`

Custom styled alert icon component.

**Props**:
```typescript
{
  size?: number;        // Icon size (default: 24)
  className?: string;   // Custom styling
  color?: string;       // Icon color (default: "currentColor")
}
```

**Usage**:
```typescript
<CircleAlertIcon size={32} color="#ff0000" />
```

---

### CustomizeCarousel

**File**: `components/CustomizeCarousel.tsx`

Generic, fully customizable carousel component with dots and arrow navigation.

**Props**:
```typescript
{
  items: T[];                          // Array of items (generic)
  renderItem: (item: T) => ReactNode;  // Render function for each item
  getItemKey: (item: T) => string;     // Unique key extractor
  itemClassName?: string;              // Class for each carousel item
  showDots?: boolean;                  // Show dot indicators (default: true)
  showArrows?: boolean;                // Show arrow navigation (default: true)
  alignment?: "start" | "center" | "end";
  itemsPerView?: number;               // Items visible at once
  centerWhenFew?: boolean;             // Center items when count is low
  breakpoints?: Record<string, number>; // Responsive breakpoints
  loop?: boolean;                      // Enable looping (default: false)
}
```

**Features**:
- Generic typing for any data type
- Responsive with breakpoint support
- Adaptive centering for few items
- Arrow and dot navigation
- Customizable rendering

**Usage**:
```typescript
<CustomizeCarousel
  items={articles}
  renderItem={(article) => <ArticleCard {...article} />}
  getItemKey={(article) => article.id}
  itemsPerView={3}
  showDots={true}
  breakpoints={{ md: 2, sm: 1 }}
/>
```

---

### ErrorState

**File**: `components/ErrorState.tsx`

Display error, empty, or success state UI with icons and messages.

**Props**:
```typescript
{
  type: "error" | "empty" | "success";
  title?: string;               // Optional custom title
  description?: string;         // Optional custom description
  iconWidth?: number;           // Icon width (default: 200)
  iconHeight?: number;          // Icon height (default: 200)
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}
```

**Features**:
- Three state types with distinct icons
- Default messages for each type
- Customizable sizing and styling
- SVG icon integration

**Usage**:
```typescript
<ErrorState
  type="error"
  title="Failed to Load"
  description="Please try again later"
  iconWidth={150}
  iconHeight={150}
/>
```

---

### Footer

**File**: `components/Footer.tsx`

Main application footer with company information and navigation.

**Features**:
- Company logo and description
- Social media links
- Navigation links (About, Contact, Careers, etc.)
- Responsive layout
- Copyright notice

---

### Header

**File**: `components/Header.tsx`

Main application header with navigation and announcement bar.

**Features**:
- Company logo
- Primary navigation menu
- Notification and profile icons
- "Trade Now" CTA button
- Dynamic announcement bar (fetched from API)
- Mobile menu dropdown
- Integration with sheet store for modals

**Integrations**:
- API: Fetches announcements from `/announcements` endpoint
- Zustand: Uses `useSheetStore` for opening profile/notification sheets

---

### Image

**File**: `components/Image.tsx`

Next.js Image wrapper that automatically handles base path configuration.

**Features**:
- Automatic base path prepending for internal images
- Passes all Next.js Image props through
- Handles both relative and absolute paths

**Usage**:
```typescript
<Image
  src="/images/logo.png"  // Automatically becomes /portal/images/logo.png
  alt="Logo"
  width={100}
  height={100}
/>
```

---

### PaginationFooter

**File**: `components/PaginationFooter.tsx`

Flexible pagination control component with items-per-page selector.

**Props**:
```typescript
{
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];  // Default: [10, 20, 30, 50]
  showItemsPerPage?: boolean;      // Default: true (desktop only)
  maxVisiblePages?: number;        // Default: 5
}
```

**Features**:
- Page number display
- Previous/Next navigation
- Items-per-page dropdown (desktop only)
- Responsive design
- Ellipsis for large page counts

**Usage**:
```typescript
<PaginationFooter
  currentPage={currentPage}
  totalItems={100}
  itemsPerPage={10}
  onPageChange={setCurrentPage}
  onItemsPerPageChange={setItemsPerPage}
  itemsPerPageOptions={[10, 20, 50]}
/>
```

---

### PaymentModel

**File**: `components/PaymentModel.tsx`

Dialog displaying payment method options (PayNow and Bank Transfer).

**Props**:
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Features**:
- PayNow option (disabled state)
- Bank Transfer option with description
- Modal dialog interface
- Responsive layout

**Usage**:
```typescript
const [open, setOpen] = useState(false);

<PaymentModel open={open} onOpenChange={setOpen} />
```

---

### Title

**File**: `components/Title.tsx`

Page title bar with optional back button and right-side content.

**Props**:
```typescript
{
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;          // Custom back handler (default: router.back())
  rightContent?: ReactNode;     // Optional right-side content
  className?: string;
}
```

**Features**:
- Navigation back button
- Responsive text sizes
- Flexible right-side content slot
- Router integration

**Usage**:
```typescript
<Title
  title="My Portfolio"
  showBackButton={true}
  rightContent={<Button>Export</Button>}
/>
```

---

## Portfolio Components

Located in `/app/(with-layout)/portfolio/_components/`.

### CashBalance

**File**: `app/(with-layout)/portfolio/_components/CashBalance.tsx`

Display cash balances across multiple currencies with expand/collapse functionality.

**Features**:
- Multi-currency balance display with flags
- Expandable/collapsible currency list
- Show more/less functionality (5 visible by default)
- Mobile dropdown menu
- Deposit button with payment modal integration
- Real-time currency data from mock data

**State**:
```typescript
const [displayCount, setDisplayCount] = useState(5);
const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
```

**Dependencies**:
- `react-circle-flags` for country flags
- `PaymentModel` component
- `INTERNAL_ROUTES` constants

---

### ChartPie

**File**: `app/(with-layout)/portfolio/_components/ChartPie.tsx`

Asset distribution donut pie chart for different portfolio types.

**Props**:
```typescript
{
  type: "CTA" | "MTA" | "SBL" | "CUT" | "iCash";
}
```

**Features**:
- Dynamic data based on account type
- Donut chart with center label showing total value
- Legend table with distribution percentages
- Color-coded asset categories
- Responsive design

**Dependencies**:
- `recharts` (Label, Pie, PieChart)
- Shadcn Chart components

**Usage**:
```typescript
<ChartPie type="CTA" />
```

---

### Dashboard

**File**: `app/(with-layout)/portfolio/_components/Dashboard.tsx`

Main portfolio dashboard with account selection and key metrics display.

**Props**:
```typescript
{
  type?: PortfolioType;
  onTypeChange?: (type: PortfolioType) => void;
}
```

**Features**:
- Trading account selector dropdown
- Dynamic layout based on account type
- Asset distribution chart (ChartPie)
- Various dashboard blocks:
  - Contracts information
  - Financial ratios
  - Margin calls (for applicable accounts)
- Responsive grid layout

**Integrations**:
- `useTradingAccountStore` (Zustand)
- Router for navigation
- PaymentModel for deposits

**Usage**:
```typescript
<Dashboard type="CTA" onTypeChange={(type) => console.log(type)} />
```

---

### HoldingPosition

**File**: `app/(with-layout)/portfolio/_components/HoldingPosition.tsx`

Display holdings/positions in a sortable, paginated table.

**Props**:
```typescript
{
  type: PortfolioType;
}
```

**Features**:
- 10-column sortable table:
  - Security code & name
  - Quantity, Avg cost, Market price
  - Market value, P/L, % Gain/Loss
  - Weights, Average market price
- Pagination with configurable items per page
- Export and Share Transfer buttons (desktop)
- Mobile dropdown menu
- Responsive design with horizontal scroll

**State**:
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
```

**Dependencies**:
- `PaginationFooter` component
- Shadcn Table/Button/Dropdown
- Mock data from `data.tsx`

---

### ExchangeRateTable

**File**: `app/(with-layout)/portfolio/_components/ExchangeRateTable.tsx`

Display foreign exchange rates in a responsive grid.

**Props**:
```typescript
{
  lastUpdated: string;
  rates: ExchangeRate[];
}
```

**Features**:
- Responsive grid layout (4 columns → 2 columns → 1 column)
- Last updated timestamp
- Currency pair display with rates
- Default mock data included

**Usage**:
```typescript
<ExchangeRateTable
  lastUpdated="2025-12-09 14:30:00"
  rates={mockRatesData}
/>
```

---

### data.tsx

**File**: `app/(with-layout)/portfolio/_components/data.tsx`

Mock data provider for portfolio components.

**Exports**:
```typescript
// 100 holdings records
export const mockHoldingsData: HoldingData[];

// 20+ currencies with balances
export const mockCurrencyData: CurrencyData[];

// Contract data
export const mockContracts: Contract[];

// Cash transactions
export const mockCashTransactions: CashTransaction[];
```

**Features**:
- Data generators with realistic values
- TypeScript interfaces for type safety
- Configurable data sizes

---

## Portfolio Detail Components

Located in `/app/(with-layout)/(detail)/portfolio/settle/_components/`.

### ContractsTable

**File**: `ContractsTable.tsx`

Display contracts or contra trades in a table format.

**Props**:
```typescript
{
  contracts: Contract[];
  activeTab: "contracts" | "contra";
  onOpenContraDetails: (id: string) => void;
}
```

**Features**:
- Sticky action column
- Status badges (Matched, Pending, Settled)
- Gain/loss color coding (green/red)
- Detail button triggers modal
- Responsive table design

**Usage**:
```typescript
<ContractsTable
  contracts={mockContracts}
  activeTab="contracts"
  onOpenContraDetails={(id) => setSelectedContra(id)}
/>
```

---

### ContraDetailsDialog

**File**: `ContraDetailsDialog.tsx`

Modal dialog showing detailed contra trade information.

**Props**:
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contraId: string;
  contraDate: string;
  dueDate: string;
  netGainLoss: number;
  currency: string;
}
```

**Features**:
- Summary cards showing key metrics
- Detailed transactions table
- Color-coded gain/loss values
- Responsive grid layout
- Scrollable content

**Dependencies**:
- `Alert` component wrapper
- Shadcn Table

---

### SummarySection

**File**: `SummarySection.tsx`

Display summary cards for the settle page.

**Props**:
```typescript
{
  contracts: Contract[];
}
```

**Features**:
- Sell/Buy contract totals calculation
- Linked payment method display
- Trading representative information
- Responsive grid layout (2 columns → 1 column)

**Integrations**:
- `useTradingAccountStore` (Zustand) for representative data

---

### CashTransactionsTable

**File**: `app/(with-layout)/(detail)/portfolio/cash-transaction/_components/CashTransactionsTable.tsx`

Display cash transaction history.

**Props**:
```typescript
{
  transactions: CashTransaction[];
}
```

**Features**:
- 7-column table:
  - Date, Description, Reference
  - Debit, Credit, Balance, Status
- Amount color coding (green for positive, red for negative)
- Responsive design with horizontal scroll

**Usage**:
```typescript
<CashTransactionsTable transactions={mockCashTransactions} />
```

---

## Market Data Components

Located in `/app/(with-layout)/(detail)/market-data/_components/`.

### CartItemList

**File**: `CartItemList.tsx`

Display selected market data subscriptions in cart view.

**Props**:
```typescript
{
  selectedItems: SelectedItem[];
  onRemoveItem?: (id: string) => void;
  showRemove?: boolean;  // Default: true
}
```

**Features**:
- Item listing with details
- Remove button with confirmation alert
- Subtotal, GST (9%), and Total calculations
- Empty state display
- Responsive layout

**Dependencies**:
- `Alert` for remove confirmation
- `ErrorState` for empty cart
- Toast notifications

---

### CartStep

**File**: `CartStep.tsx`

Cart review step in market data subscription flow.

**Props**:
```typescript
{
  selectedItems: SelectedItem[];
  setSelectedItems: (items: SelectedItem[]) => void;
  onCheckout: () => void;
}
```

**Features**:
- Scrollable cart items list
- "Remove All" functionality with confirmation
- Continue to checkout button
- Validation (prevents empty cart checkout)

---

### DeclarationStep

**File**: `DeclarationStep.tsx`

Professional subscriber declaration form.

**Props**:
```typescript
{
  onConfirm: () => void;
}
```

**Features**:
- 6 textarea fields for employment information:
  - Employer name and type
  - Position and duties
  - Trading/investment authority
  - Direct report count and managerial level
- Form validation
- Scrollable layout

---

### NonProDeclarationStep

**File**: `NonProDeclarationStep.tsx`

Non-professional qualification questionnaire.

**Props**:
```typescript
{
  onConfirm: () => void;
}
```

**Features**:
- 11 yes/no questions via radio buttons
- Questions cover:
  - Employment in financial services
  - Professional licenses
  - Asset management responsibilities
- Scrollable form
- Validation before submission

---

### MarketItem

**File**: `MarketItem.tsx`

Individual market data subscription product selector.

**Props**:
```typescript
{
  title: string;
  description: string;
  image: string;
  dropDownItems: { title: string; price: string }[];
  onSelectItem: (item: SelectedItem) => void;
}
```

**Features**:
- Dropdown with radio button options
- Visual feedback for selected items
- "Add to Cart" button
- Image display
- State management for selection

**State**:
```typescript
const [selectedItem, setSelectedItem] = useState<string | null>(null);
const [tempItem, setTempItem] = useState<string | null>(null);
const [open, setOpen] = useState(false);
```

---

### TermsStep

**File**: `TermsStep.tsx`

Terms & conditions review and agreement step.

**Props**:
```typescript
{
  setCurrenStep: (step: number) => void;
  selectedItems: SelectedItem[];
}
```

**Features**:
- Links to external terms documents
- Subscription summary display
- Checkbox agreement requirement
- Submit button with validation
- Scrollable content

---

### Professional

**File**: `Professional.tsx`

Market data options for professional subscribers.

**Features**:
- Async data loading for:
  - Research articles
  - Market data products
- Error and empty state handling
- Responsive grid layout
- Integration with `MarketItem` component

**State**:
```typescript
const [researchArticles, setResearchArticles] = useState([]);
const [marketData, setMarketData] = useState([]);
const [error, setError] = useState(null);
```

---

### NonProfessional

**File**: `NonProfessional.tsx`

Market data options for non-professional subscribers.

**Props**:
```typescript
{
  selectedItems: SelectedItem[];
  setSelectedItems: (items: SelectedItem[]) => void;
}
```

**Features**:
- Similar to Professional component
- Selection capability for adding to cart
- Error/empty state handling
- Responsive layout

---

## Form & Application Components

Located in `/app/(with-layout)/(form)/_components/`.

### ApplicationForm

**File**: `ApplicationForm.tsx`

Product application form for IOP/Commercial Paper.

**Props**:
```typescript
{
  pathname: "alternatives" | "securities";
}
```

**Features**:
- Currency selection with country flags
- Quantity picker with +/- buttons
- Estimated net value calculation
- Form validation
- Terms agreement checkbox
- Loading states
- Toast notifications on success/error

**State**:
```typescript
const [quantity, setQuantity] = useState(1);
const [agreed, setAgreed] = useState(false);
const [formValues, setFormValues] = useState({...});
const [errors, setErrors] = useState({...});
```

**Integrations**:
- Router for navigation
- External invoice link (`CGSI.INVOICE`)

---

### AnalysisTab

**File**: `AnalysisTab.tsx`

Collapsible accordion displaying fund analysis information.

**Features**:
- 4 expandable sections:
  - Investment Objective
  - Strategies
  - Risk Indicators
  - Performance
- Lorem ipsum placeholder content
- Accordion UI (single item open at a time)

---

### OverviewTab

**File**: `OverviewTab.tsx`

Product overview with timeline and fundamentals.

**Features**:
- Banner image display
- Timeline showing:
  - Offer Date (completed)
  - Current Date (active)
  - Upcoming Events
- Fundamentals table with 12 key metrics
- Responsive design
- Icon indicators (Check, Dot)

---

### DocumentsTab

**File**: `DocumentsTab.tsx`

Reference documents listing with download links.

**Features**:
- 3 document items with file icons
- Opens documents in new tab
- Reusable DocumentItem sub-component

**Sub-component**:
```typescript
<DocumentItem
  title="Product Brochure"
  icon={<FileText />}
  url="/documents/brochure.pdf"
/>
```

---

### Navigation

**File**: `Navigation.tsx`

Form page navigation header with page selector.

**Features**:
- Page title dropdown (Securities/Alternatives)
- Contact Us button
- My Applications link (opens sheet)
- Responsive layout

**Integrations**:
- Router for navigation
- `useSheetStore` for opening application sheet

---

### Sidebar

**File**: `Sidebar.tsx`

Product selection sidebar for form pages.

**Features**:
- List of 4 ETF/product options
- "Applied" badge for submitted applications
- Details button with selection state
- Scrollable list
- Error state handling

**Integrations**:
- `useSelectionStore` (Zustand) for product selection

**Usage**:
```typescript
<Sidebar />  // No props, manages own state via store
```

---

## Discover Page Components

Located in `/app/(with-layout)/discover/_components/`.

### Insight

**File**: `Insight.tsx`

CGSI insights carousel section with API integration.

**Features**:
- Async API data loading from insights endpoint
- Carousel of insight cards
- Each card shows:
  - Title and description
  - Publication date
  - Thumbnail image
- Loading state
- Error handling

**State**:
```typescript
const [insights, setInsights] = useState([]);
const [loading, setLoading] = useState(true);
```

**Sub-component**:
```typescript
<InsightCard
  title="Market Update"
  description="..."
  date="2025-12-09"
  image="/images/insight.jpg"
  url="https://..."
/>
```

**Integrations**:
- API: `ENDPOINTS.insights(LANG.EN)`

---

### ResearchArticles

**File**: `ResearchArticles.tsx`

Research articles carousel section with fixed content.

**Features**:
- Fixed array of 4 research articles
- Each article has:
  - Title and description
  - Tags (e.g., "Fundamental", "Technical")
  - Author and publication date
  - Background image
- Carousel display
- External PDF links

**Sub-component**:
```typescript
<ResearchArticleCard
  title="Q4 Market Outlook"
  description="..."
  tags={["Fundamental", "Market Analysis"]}
  author="John Doe"
  date="Dec 1, 2025"
  bgClass="bg-gradient-blue"
  pdfUrl="https://..."
/>
```

**Utility**:
- `getBgImageClass()` - Returns random gradient class

---

### StockResearch

**File**: `StockResearch.tsx`

Stock research tools section linking to external tools.

**Features**:
- 2 gradient cards:
  - iScreener tool
  - Stock Filter tool
- Responsive layout
- Images and descriptions
- External navigation

**Sub-component**:
```typescript
<StockResearchCard
  title="iScreener"
  description="Advanced stock screening tool"
  image="/images/screener.png"
  url="https://screener.cgsi.com"
/>
```

---

## Donation Components

Located in `/app/(with-layout)/(detail)/donations/_components/`.

### OnetimeForm

**File**: `OnetimeForm.tsx`

One-time donation form with payment method selection.

**Features**:
- Amount input with validation:
  - Minimum $10
  - Numeric only
  - Real-time error display
- Payment method selection:
  - PayNow (QR code)
  - Trust Account (direct transfer)
- Terms agreement checkbox
- Submit button with loading state
- Toast notifications

**State**:
```typescript
const [amount, setAmount] = useState<number | null>(null);
const [inputValue, setInputValue] = useState("");
const [paymentMethod, setPaymentMethod] = useState("paynow");
const [agreed, setAgreed] = useState(false);
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
```

**Validation**:
- Amount must be ≥ $10
- Payment method required
- Terms must be agreed

---

### RecurringForm

**File**: `RecurringForm.tsx`

Recurring donation form with active donations management.

**Features**:
- Duration selector (Monthly, Quarterly, Yearly)
- Amount dropdown ($10-$500)
- Setup modal dialog
- Active recurring donations list
- Cancel donation functionality with confirmation
- Form validation
- Toast notifications

**State**:
```typescript
const [formValues, setFormValues] = useState({
  duration: "monthly",
  amount: ""
});
const [agreed, setAgreed] = useState(false);
const [errors, setErrors] = useState({});
const [open, setOpen] = useState(false);
const [recurringDonations, setRecurringDonations] = useState([...]);
```

**Features**:
- Duration and amount validation
- Modal for setup confirmation
- List of active donations with cancel option
- Alert confirmation before cancellation

---

## Sidebar & Sheet Components

Located in `/app/(minimal)/sidebar/_components/`.

### CustomSheetTitle

**File**: `CustomSheetTitle.tsx`

Reusable header component for sidebar sheets.

**Props**:
```typescript
{
  title: string;
  backTo?: SheetType;  // Optional back navigation
}
```

**Features**:
- Back button navigation (if `backTo` provided)
- Close button (always visible)
- Sheet title styling
- Integration with sheet store

**Integrations**:
- `useSheetStore` for navigation

**Usage**:
```typescript
<CustomSheetTitle
  title="User Profile"
  backTo="settings"  // Optional back to settings
/>
```

---

### Group

**File**: `Group.tsx`

Labeled container group for organizing form fields.

**Props**:
```typescript
{
  title: string;
  children: ReactNode;
  childrenClassName?: string;
}
```

**Features**:
- Positioned label above content
- Border styling
- Flex layout
- Utility for grouping related fields

**Usage**:
```typescript
<Group title="Personal Information">
  <Input name="firstName" />
  <Input name="lastName" />
</Group>
```

---

## Component Statistics

### Summary

- **Total Custom Components**: 41
- **Average Props per Component**: 3-5
- **Components with State**: 28 (68%)
- **API-Integrated Components**: 6
- **Store-Integrated Components**: 8

### By Category

| Category | Count | Key Features |
|----------|-------|--------------|
| Core Components | 10 | Reusable utilities, layouts |
| Portfolio | 6 | Data visualization, tables |
| Portfolio Detail | 4 | Transactions, settlements |
| Market Data | 8 | Subscriptions, cart flow |
| Form/Application | 6 | Product applications, ETFs |
| Discover | 3 | Content carousels, research |
| Donations | 2 | Payment forms |
| Sidebar/Sheet | 2 | Navigation, grouping |

### Integration Patterns

**State Management (Zustand)**:
- `tradingAccountStore`: Dashboard, SummarySection, Sidebar
- `sheetStore`: Header, Navigation, CustomSheetTitle
- `selectionStore`: Sidebar (form selection)
- `userStore`: (available for user data)

**API Integration** (`fetchAPI`):
- Header (announcements)
- Insight (insights articles)
- Professional/NonProfessional (market data)

**External Integrations**:
- `react-circle-flags`: Currency flags
- `recharts`: Charts and visualizations
- `lucide-react`: Icons throughout
- `sonner`: Toast notifications

### Component Design Patterns

1. **Controlled Components**: Most form components are controlled via React state
2. **Compound Components**: Alert, Dialog, Sheet patterns
3. **Render Props**: CustomizeCarousel uses render props for flexibility
4. **Container/Presenter**: Separation of logic and UI (e.g., Dashboard)
5. **Composition**: Extensive use of children props and slots

---

## Best Practices

When using these components:

1. **Import with path alias**: Always use `@/` prefix
   ```typescript
   import { Alert } from "@/components/Alert";
   ```

2. **Type Safety**: All components have TypeScript interfaces for props

3. **Responsive Design**: Components use Tailwind's responsive classes (xs, md, lg, xl)

4. **State Management**: Prefer Zustand stores for shared state

5. **Error Handling**: Use ErrorState component for error/empty states

6. **Loading States**: Implement loading states for async operations

7. **Accessibility**: Components built on Radix UI primitives for accessibility

8. **Styling**: Use Tailwind classes, CVA for variants

---

## Contributing

When creating new custom components:

1. Place in appropriate directory (`/components/` for shared, `/_components/` for page-specific)
2. Export TypeScript interface for props
3. Add JSDoc comments for complex props
4. Implement error boundaries where appropriate
5. Update this documentation with component details
6. Follow existing naming conventions
7. Use existing utility components (Alert, ErrorState, etc.) where possible

---

**Last Updated**: 2025-12-09
**Total Components Documented**: 41
