# AlphaBuilder MVP Scope

## In Scope (Must Have)

### Core Features
✅ **User Authentication**
- Email/password login
- Password reset
- Session management
- Basic role support (admin, estimator, viewer)

✅ **Project Management**
- Create new projects
- Edit project details
- Clone existing projects
- Delete projects
- Project status tracking (draft, submitted, won, lost)

✅ **Trade System**
- 10 default trade templates
- Add trades to project
- Remove trades from project
- Reorder trades
- Trade-level subtotals

✅ **Line Item Entry**
- Add line items to trades
- Quantity input
- Material cost calculation
- Labor cost calculation
- Line item totals
- Auto-save on change

✅ **Calculations**
- Real-time calculation updates
- Material/labor subtotals
- Overhead percentage
- Profit percentage
- Tax calculation
- Grand total

✅ **PDF Export**
- Generate PDF matching Excel format
- Include all trades and line items
- Summary page with totals
- Client information header
- Download to device

✅ **Basic UI/UX**
- Responsive design (desktop + tablet)
- Clean, simple interface
- Loading states
- Error messages
- Success confirmations

## Out of Scope (Phase 2)

### Advanced Features
❌ **Advanced Authentication**
- SSO/OAuth providers beyond Google
- Two-factor authentication
- Team/organization management
- Advanced permissions

❌ **Collaboration**
- Multi-user editing
- Comments/notes system
- Approval workflows
- Change tracking

❌ **Advanced Exports**
- Excel export
- CSV export
- Custom PDF templates
- Branded PDFs
- Email delivery

❌ **Integrations**
- QuickBooks sync
- CRM integration
- Calendar integration
- Payment processing

❌ **Advanced Features**
- Photo attachments
- Document management
- Cost databases
- Supplier catalogs
- Historical pricing

❌ **Analytics**
- Profitability reports
- Win/loss analysis
- Time tracking
- ROI calculations
- Dashboard widgets

❌ **Mobile**
- Native mobile apps
- Offline mode
- Photo capture
- GPS/location features

## Phase 1 Deliverables (MVP)

### Week 1-2: Foundation
- [x] Database schema
- [x] Next.js project setup
- [x] Authentication system
- [x] Base UI components
- [ ] Project CRUD operations

### Week 3-4: Estimation Engine
- [ ] Trade management
- [ ] Line item system
- [ ] Calculation engine
- [ ] Real-time updates
- [ ] Data validation

### Week 5-6: Export & Polish
- [ ] PDF generation
- [ ] PDF formatting
- [ ] Performance optimization
- [ ] Error handling
- [ ] User testing

### Week 7-8: Launch Prep
- [ ] Bug fixes
- [ ] Documentation
- [ ] Deployment setup
- [ ] User training materials
- [ ] Go-live

## Technical Constraints

### Performance Requirements
- Page load: < 3 seconds
- Calculation update: < 100ms
- PDF generation: < 5 seconds
- Auto-save: < 500ms

### Browser Support
- Chrome (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Firefox (last 2 versions)

### Data Limits (MVP)
- 100 projects per user
- 50 trades per project
- 100 line items per trade
- 10MB PDF size max

## Definition of Done

### Feature Complete When:
1. Functionality works as specified
2. UI is responsive and accessible
3. Error cases handled gracefully
4. Tests written (unit + integration)
5. Documentation updated
6. Code reviewed and approved

### MVP Complete When:
1. All "In Scope" features complete
2. No critical bugs
3. Performance targets met
4. Security review passed
5. Deployment successful
6. User documentation ready

## Risk Mitigations

### High Risk Items
1. **Excel Formula Complexity**
   - Mitigation: Simplify calculations for MVP
   - Fallback: Manual calculation override

2. **PDF Generation Performance**
   - Mitigation: Queue system for large PDFs
   - Fallback: Email link when ready

3. **Data Migration from Excel**
   - Mitigation: Manual entry for MVP
   - Fallback: Import wizard in Phase 2

4. **Browser Compatibility**
   - Mitigation: Progressive enhancement
   - Fallback: "Best in Chrome" messaging

## Success Criteria

### Quantitative
- 5 beta users successfully create estimates
- 100% calculation accuracy vs Excel
- < 5 second end-to-end for simple estimate
- Zero data loss incidents

### Qualitative
- Users prefer over Excel
- Intuitive without training
- Professional PDF output
- Positive beta feedback

## Post-MVP Roadmap

### Phase 2 (Months 3-4)
- Excel import/export
- Team collaboration
- Email delivery
- Custom templates

### Phase 3 (Months 5-6)
- Mobile apps
- Offline mode
- Advanced reporting
- Integrations

### Phase 4 (Months 7-8)
- AI suggestions
- Cost databases
- Supplier integration
- Enterprise features
