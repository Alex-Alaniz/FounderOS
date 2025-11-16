# AlphaBuilder User Flows

## 1. New User Onboarding

```mermaid
Start -> Sign Up -> Verify Email -> Company Setup -> Tutorial -> Dashboard
```

### Steps:
1. **Sign Up Page**
   - Email/password or Google OAuth
   - Accept terms
   - Submit

2. **Email Verification**
   - Check email
   - Click verification link
   - Return to app

3. **Company Setup**
   - Company name
   - Default overhead %
   - Default profit %
   - Time zone
   - Currency

4. **Interactive Tutorial**
   - Create first project
   - Add a trade
   - Enter quantities
   - View summary
   - Export PDF

5. **Dashboard**
   - View sample projects
   - Start real project
   - Access help resources

## 2. Create New Project

```mermaid
Dashboard -> New Project -> Client Info -> Project Details -> Add Trades -> Review -> Save
```

### Steps:
1. **Click "New Project"**
   - From dashboard
   - Or from project list

2. **Enter Client Information**
   - Client name (required)
   - Email (optional)
   - Phone (optional)
   - Notes

3. **Project Details**
   - Project name
   - Job site address
   - Project type
   - Start date
   - Overhead/profit percentages

4. **Add Trades**
   - Select from templates
   - Or create custom trade
   - Reorder as needed

5. **Review**
   - Check all information
   - Edit if needed

6. **Save**
   - Save as draft
   - Continue to estimation

## 3. Estimate Entry Flow

```mermaid
Select Trade -> View Line Items -> Enter Quantities -> Calculate -> Next Trade -> Summary
```

### Steps:
1. **Trade Selection**
   - Click trade from sidebar
   - Or use next/previous buttons

2. **Line Items Display**
   - See all items for trade
   - Grouped by category
   - Unit costs visible

3. **Quantity Entry**
   - Enter quantities
   - Tab through fields
   - Auto-calculation on blur

4. **Real-time Calculation**
   - See material cost
   - See labor cost
   - See line total

5. **Navigation**
   - Save & next trade
   - Or jump to specific trade
   - Progress indicator

6. **Summary View**
   - All trades totaled
   - Overhead/profit applied
   - Tax calculated
   - Grand total

## 4. Quick Estimate Flow (Power User)

```mermaid
Cmd+N -> Quick Entry Form -> Bulk Paste -> Auto-Calculate -> Export
```

### Steps:
1. **Keyboard Shortcut**
   - Cmd/Ctrl + N for new
   - Opens quick entry modal

2. **Rapid Entry**
   - Type trade code
   - Tab to quantities
   - Enter for next line

3. **Bulk Operations**
   - Paste from Excel
   - Auto-parse columns
   - Map to fields

4. **Instant Calculate**
   - Running totals
   - No page refresh

5. **Quick Export**
   - Cmd/Ctrl + E
   - Default PDF settings
   - Auto-download

## 5. PDF Export Flow

```mermaid
Summary -> Export Button -> Preview -> Settings -> Generate -> Download/Email
```

### Steps:
1. **From Summary Page**
   - Click "Export PDF"
   - Or use Cmd/Ctrl + E

2. **Preview Modal**
   - See PDF preview
   - Check formatting

3. **Export Settings**
   - Include/exclude sections
   - Add cover page
   - Add terms & conditions
   - Show/hide costs

4. **Generate PDF**
   - Processing indicator
   - ~3 seconds generation

5. **Delivery Options**
   - Download immediately
   - Email to client
   - Save to cloud
   - Get shareable link

## 6. Project Revision Flow

```mermaid
Open Project -> Make Changes -> Save Version -> Compare -> Submit Revision
```

### Steps:
1. **Open Existing Project**
   - From project list
   - Status = submitted

2. **Enter Revision Mode**
   - Auto-creates version
   - Shows revision banner

3. **Make Changes**
   - Update quantities
   - Add/remove items
   - Adjust markups

4. **Save as Version**
   - Version naming
   - Change notes
   - Timestamp

5. **Compare Versions**
   - Side-by-side view
   - Highlight changes
   - Show delta amounts

6. **Submit Revision**
   - Generate revision PDF
   - Email to client
   - Update project status

## 7. Mobile Quick View

```mermaid
Mobile Login -> Project List -> Project Summary -> Trade Details -> Quick Edit
```

### Steps:
1. **Mobile Optimized Login**
   - Large touch targets
   - Remember device

2. **Simplified Project List**
   - Cards instead of table
   - Swipe actions
   - Quick status badges

3. **Summary First**
   - Total at top
   - Collapsible trades
   - Key metrics visible

4. **Trade Drill-Down**
   - Tap to expand
   - Vertical scrolling
   - Pinch to zoom

5. **Quick Edits**
   - Long-press to edit
   - Number pad for quantities
   - Save indicator

## 8. Template Creation Flow

```mermaid
Settings -> Templates -> New Template -> Add Items -> Set Defaults -> Save -> Apply
```

### Steps:
1. **Access Templates**
   - Settings menu
   - Templates section

2. **Create New Template**
   - Name template
   - Choose category
   - Set as default option

3. **Add Line Items**
   - Item description
   - Default unit
   - Default costs
   - Order items

4. **Configure Formulas**
   - Optional calculations
   - Quantity relationships
   - Conditional items

5. **Save Template**
   - Validate items
   - Save to library

6. **Apply to Projects**
   - Available in new projects
   - Can apply to existing

## Error Handling

### Common Error Scenarios:
1. **Lost Connection**
   - Auto-save to local storage
   - Retry when connected
   - Show offline indicator

2. **Invalid Data**
   - Inline validation
   - Clear error messages
   - Highlight problem fields

3. **Calculation Errors**
   - Prevent divide by zero
   - Handle negative values
   - Show warnings for unusual values

4. **Export Failures**
   - Retry option
   - Alternative format
   - Error report to support

## Success Indicators

### User Feedback:
1. **Save Confirmation**
   - Toast notification
   - Green checkmark
   - 2-second display

2. **Calculation Updates**
   - Smooth animation
   - Color change for updates
   - Running total visible

3. **Export Success**
   - Download started message
   - Email sent confirmation
   - View PDF button

4. **Progress Tracking**
   - Progress bar for long operations
   - Step indicators
   - Completion percentage
