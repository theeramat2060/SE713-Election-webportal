# 🎨 UX Analysis: Online Voting System

**Role:** UX Researcher & Information Architect  
**Project:** SE713 Online Election System  
**Date:** March 2026

---

## 1. User Personas & Journeys

### 👥 Persona 1: Voter (ผู้มีสิทธิเลือกตั้ง)
**Profile:**
- Age: 18-80 years old
- Tech literacy: Low to medium
- Device: Mobile and desktop
- Goals: Register, vote easily, see results
- Pain points: Confusing forms, unclear voting process

**User Journey:**
```
Discovery → Registration → Login → Vote → View Results → Logout
   ↓           ↓            ↓       ↓         ↓          ↓
Landing    Fill form    Enter ID  Choose   Browse by   Exit
  page     (5 steps)   + password candidate  district  safely
```

---

### 🏛️ Persona 2: Election Commission (กกต.)
**Profile:**
- Age: 30-60 years old
- Tech literacy: Medium to high
- Device: Desktop primarily
- Goals: Manage elections, control ballot boxes, monitor results
- Pain points: Complex admin interfaces, unclear status indicators

**User Journey:**
```
Login → Dashboard → Manage Parties → Manage Candidates → Control Ballot → Monitor
  ↓        ↓            ↓                  ↓                ↓            ↓
Auth   Overview   Create/Edit/Delete  Create/Edit/Delete  Open/Close  Results
page    stats      with logos          with photos       per district tracking
```

---

### ⚙️ Persona 3: Administrator (ผู้ดูแลระบบ)
**Profile:**
- Age: 25-55 years old
- Tech literacy: High
- Device: Desktop
- Goals: Setup districts, manage user roles, system maintenance
- Pain points: Bulk operations, user search, role management

**User Journey:**
```
Login → Dashboard → Manage Districts → Manage Users → System Oversight
  ↓        ↓             ↓                  ↓              ↓
Auth    Districts   Create/Edit/Delete  Search & toggle  Monitor
page     list       provinces/districts    roles          activity
```

---

### 🌍 Persona 4: Public Visitor
**Profile:**
- Age: Any
- Tech literacy: Low to high
- Device: Any
- Goals: View results, understand party platforms
- Pain points: Complex data, unclear winners

**User Journey:**
```
Landing → Browse Results → View Party Details → Understand Winners
   ↓           ↓                 ↓                    ↓
Direct    Select district    Expand party info    See rankings
access   from dropdown      & candidate list      & badges
```

---

## 2. Information Architecture

### 🏗️ Site Structure

```
Public Layer (No Auth)
├── / (Login)
├── /register
├── /admin-login
├── /results
└── /parties

Protected Layer: Voter
└── /voter
    └── /vote

Protected Layer: EC
└── /ec
    ├── /parties (list/create/edit)
    ├── /candidates (list/create/edit)
    └── /ballot

Protected Layer: Admin
└── /admin
    ├── /districts (list/create/edit)
    └── /users
```

**UX Rationale:**
- ✅ **Flat hierarchy** - Maximum 3 levels deep
- ✅ **Role-based segregation** - Clear boundaries between user types
- ✅ **Public-first** - Most important content accessible without login
- ✅ **Predictable URLs** - RESTful patterns (e.g., /ec/parties/create)

---

## 3. Page-by-Page UX Analysis

### 📄 3.1 Login Page (`/login`)

#### Section Structure:
```
┌─────────────────────────────────┐
│  HEADER: Logo + Title           │
│  "🗳️ ระบบเลือกตั้ง"            │
├─────────────────────────────────┤
│  FORM:                          │
│  └─ National ID (13 digits)     │
│  └─ Password                    │
│  └─ Login Button [Primary CTA]  │
├─────────────────────────────────┤
│  LINKS:                         │
│  └─ Register (Secondary CTA)    │
│  └─ Admin Login                 │
│  └─ View Results (Public)       │
└─────────────────────────────────┘
```

#### UX Rationale:
1. **Single-column layout** - Reduces cognitive load
2. **National ID first** - Matches Thai government forms (familiar pattern)
3. **Visual hierarchy** - Primary action (Login) stands out
4. **Escape hatches** - Links to register, admin, and public pages
5. **Validation feedback** - Real-time error messages below fields
6. **Mobile-first** - Optimized for small screens (48px+ touch targets)

#### Design Decisions:
- ✅ **Green color scheme** - Associated with "go", "proceed", democracy
- ✅ **13-digit validation** - Prevents invalid submissions
- ✅ **Password masking** - Security with toggle option
- ✅ **Remember ID pattern** - Common for Thai government websites

---

### 📝 3.2 Registration Page (`/register`)

#### Section Structure:
```
┌─────────────────────────────────┐
│  HEADER: Title + Description    │
├─────────────────────────────────┤
│  FORM (Progressive Disclosure): │
│  1. Personal Info:              │
│     └─ Title, Name, Surname     │
│  2. Identity:                   │
│     └─ National ID, Address     │
│  3. Location:                   │
│     └─ Constituency (Dropdown)  │
│  4. Security:                   │
│     └─ Password + Confirm       │
│  5. Action:                     │
│     └─ Register Button [CTA]    │
└─────────────────────────────────┘
```

#### UX Rationale:
1. **Logical grouping** - Related fields together (Gestalt principles)
2. **Top-to-bottom flow** - Natural reading pattern
3. **Constituency dropdown** - Prevents typos, ensures data integrity
4. **Password confirmation** - Reduces registration errors
5. **Inline validation** - Immediate feedback (13-digit ID, password strength)
6. **Success → Auto-login** - Reduces friction (one less step)

#### Design Decisions:
- ✅ **Loading state** - Shows "Loading constituencies..." while fetching
- ✅ **Disabled state** - Submit button disabled until valid
- ✅ **Error placement** - Below each field (proximity principle)
- ✅ **Required indicators** - Asterisks (*) for required fields

---

### 🗳️ 3.3 Vote Page (`/voter/vote`)

#### Section Structure:
```
┌─────────────────────────────────┐
│  HEADER: District + Status      │
│  "กรุงเทพฯ เขต 1 | หีบเปิด"    │
├─────────────────────────────────┤
│  INFO BOX: Instructions         │
│  "เลือกผู้สมัคร 1 คน"          │
├─────────────────────────────────┤
│  CANDIDATE CARDS (Grid):        │
│  ┌───────┐ ┌───────┐ ┌───────┐ │
│  │ Photo │ │ Photo │ │ Photo │ │
│  │ #1    │ │ #2    │ │ #3    │ │
│  │ Name  │ │ Name  │ │ Name  │ │
│  │ Party │ │ Party │ │ Party │ │
│  │ [Vote]│ │ [Vote]│ │ [Vote]│ │
│  └───────┘ └───────┘ └───────┘ │
├─────────────────────────────────┤
│  CURRENT VOTE: (if voted)       │
│  "คุณเลือก: #2 สมชาย ใจดี"     │
└─────────────────────────────────┘
```

#### UX Rationale:
1. **Card-based layout** - Easy scanning, visual comparison
2. **Photo-first** - Human faces create emotional connection
3. **Large vote buttons** - Clear call-to-action (mobile-friendly)
4. **Visual feedback** - Selected card has border/highlight
5. **Status indicator** - Ballot open/closed shown prominently
6. **Current vote display** - Transparency (shows who they voted for)
7. **Change vote ability** - Until ballot closes (flexibility)

#### Design Decisions:
- ✅ **Grid layout** - 3 columns desktop, 1-2 on mobile
- ✅ **Candidate numbers** - Prominent badges (accessibility for those who can't read)
- ✅ **Party logos** - Visual recognition (faster than text)
- ✅ **Disabled state** - When ballot closed (prevent frustration)

---

### 📊 3.4 Results Page (`/results`)

#### Section Structure:
```
┌─────────────────────────────────┐
│  HEADER: Title + Selector       │
│  "ผลการเลือกตั้ง"              │
│  [Constituency Dropdown ▼]      │
├─────────────────────────────────┤
│  STATUS BADGE:                  │
│  "🔓 เปิดหีบอยู่" or           │
│  "🔒 ปิดหีบแล้ว"              │
├─────────────────────────────────┤
│  CANDIDATE RESULTS (Ranked):    │
│  ┌─────────────────────────┐   │
│  │ 🏆 #1 Winner            │   │
│  │ Photo + Name + Party    │   │
│  │ Votes: 12,345 (45%)     │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🥈 #2                   │   │
│  │ Photo + Name + Party    │   │
│  │ Votes: 8,123 (30%)      │   │
│  └─────────────────────────┘   │
│  ...                            │
└─────────────────────────────────┘
```

#### UX Rationale:
1. **Dropdown selector** - Easy district switching (progressive disclosure)
2. **Winner prominence** - Trophy icon + gold highlight (visual hierarchy)
3. **Ranking badges** - 1st, 2nd, 3rd clearly marked
4. **Vote counts visible** - Only when ballot closed (data integrity)
5. **Percentage display** - Easy comparison (data visualization)
6. **Status indicator** - Clear ballot state (information scent)

#### Design Decisions:
- ✅ **Winner highlight** - Different background color (yellow/gold)
- ✅ **Descending order** - Winner at top (F-pattern reading)
- ✅ **Hidden votes when open** - Prevents influencing ongoing votes
- ✅ **Auto-load first district** - Reduces empty states

---

### 🎯 3.5 Party Overview Page (`/parties`)

#### Section Structure:
```
┌─────────────────────────────────┐
│  HEADER: Title + Summary        │
│  "ภาพรวมพรรคการเมือง"          │
│  Seats: 100 | Closed: 75        │
├─────────────────────────────────┤
│  PARTY CARDS (Ranked by Seats): │
│  ┌─────────────────────────┐   │
│  │ Rank #1 | Logo          │   │
│  │ Party Name              │   │
│  │ Seats: 45 (45%)         │   │
│  │ [▼ View Details]        │   │
│  │ ┌──────────────────┐    │   │
│  │ │ EXPANDED:        │    │   │
│  │ │ Policy text...   │    │   │
│  │ │ Candidates (10): │    │   │
│  │ │ - Candidate 1    │    │   │
│  │ │ - Candidate 2    │    │   │
│  │ └──────────────────┘    │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

#### UX Rationale:
1. **Expandable cards** - Progressive disclosure (reduces overwhelming data)
2. **Ranking order** - Winner first (satisfies primary goal)
3. **Seat percentages** - Quick comparison (data visualization)
4. **Party logos** - Visual recognition (branding)
5. **Collapsible details** - Policy + candidates on-demand
6. **Summary stats** - Total context at top (orientation)

#### Design Decisions:
- ✅ **Expand in place** - No page navigation (smooth UX)
- ✅ **Chevron icons** - Clear affordance (▼ = expand)
- ✅ **Candidate list** - Shows district representation
- ✅ **Load details on expand** - Performance optimization

---

### 🏛️ 3.6 EC Party Management (`/ec/parties`)

#### Section Structure:
```
┌─────────────────────────────────┐
│  HEADER: Title + [Create] CTA   │
│  "จัดการพรรคการเมือง" [+ สร้าง]│
├─────────────────────────────────┤
│  PARTY GRID:                    │
│  ┌───────────┐ ┌───────────┐   │
│  │ Logo      │ │ Logo      │   │
│  │ Name      │ │ Name      │   │
│  │ Policy... │ │ Policy... │   │
│  │ [Edit]    │ │ [Edit]    │   │
│  │ [Delete]  │ │ [Delete]  │   │
│  └───────────┘ └───────────┘   │
└─────────────────────────────────┘
```

#### UX Rationale:
1. **Create button prominent** - Primary action (Fitts's law)
2. **Grid layout** - Easy scanning (visual grouping)
3. **Inline actions** - Edit/Delete per card (proximity)
4. **Delete confirmation** - Inline (no modal disruption)
5. **Logo preview** - Visual verification before action

---

### 📋 3.7 EC Party Form (`/ec/parties/create`)

#### Section Structure:
```
┌─────────────────────────────────┐
│  HEADER: "สร้างพรรคใหม่"       │
├─────────────────────────────────┤
│  FORM:                          │
│  1. Logo Upload:                │
│     ┌───────────────┐           │
│     │ [Preview]     │           │
│     │ or            │           │
│     │ [Upload Area] │           │
│     └───────────────┘           │
│  2. Name: [Input]               │
│  3. Policy: [Textarea]          │
│  4. Actions:                    │
│     [Save] [Cancel]             │
└─────────────────────────────────┘
```

#### UX Rationale:
1. **Image upload first** - Visual-first (attention grabbing)
2. **Preview immediately** - Visual feedback (confirmation)
3. **Large textarea** - Policy is long-form (usability)
4. **File validation** - Size/type checks (error prevention)
5. **Cancel button** - Escape hatch (reversibility)

#### Design Decisions:
- ✅ **Drag & drop** - Modern upload UX
- ✅ **Remove button** - On preview (error correction)
- ✅ **5MB limit** - Shown upfront (expectation setting)
- ✅ **Auto-save indicator** - "Saving..." feedback

---

### 👥 3.8 Admin User Management (`/admin/users`)

#### Section Structure:
```
┌─────────────────────────────────┐
│  HEADER: Title + Stats          │
│  "จัดการผู้ใช้"                │
│  Voters: 1,234 | EC: 12         │
├─────────────────────────────────┤
│  SEARCH: [🔍 Input]             │
├─────────────────────────────────┤
│  USER TABLE:                    │
│  Name | ID | District | Role |  │
│  สมชาย | 123... | 1 | VOTER | │
│  [Change to EC →]               │
└─────────────────────────────────┘
```

#### UX Rationale:
1. **Search prominent** - Primary task (findability)
2. **Table layout** - Data density (scanability)
3. **Inline role toggle** - Direct manipulation (efficiency)
4. **Summary stats** - Context at glance (information scent)
5. **Filter by role** - Task-focused (filtering)

#### Design Decisions:
- ✅ **Real-time search** - Instant feedback
- ✅ **Role badges** - Color-coded (visual distinction)
- ✅ **One-click toggle** - No confirmation for role change (reversible)
- ✅ **Sort by role** - Groups similar users

---

## 4. Navigation Patterns

### 🧭 Primary Navigation (Navbar)

#### Structure:
```
Logo | Vote | Results | Parties | User (Logout) | ☰ (Mobile)
```

#### UX Rationale:
1. **Persistent top bar** - Always accessible (way-finding)
2. **Logo = Home** - Web convention (learnability)
3. **Role-aware menus** - Only show relevant links (simplicity)
4. **User indicator** - Shows name + role (context awareness)
5. **Mobile hamburger** - Standard pattern (familiarity)

#### Responsive Behavior:
- **Desktop:** Horizontal bar with all links
- **Tablet:** Collapsed to hamburger at <768px
- **Mobile:** Full-screen overlay menu

---

## 5. Design System

### 🎨 Color Palette

**Primary Colors:**
- Green (#10B981) - Login, success, voter actions
- Purple (#9333EA) - Admin, EC, authority
- Blue (#3B82F6) - Information, links, secondary

**Semantic Colors:**
- Red (#EF4444) - Errors, warnings, delete
- Yellow (#F59E0B) - Alerts, pending, winners
- Gray (#6B7280) - Neutral, disabled, borders

**UX Rationale:**
- ✅ **Green for voting** - "Go", democracy, positive action
- ✅ **Purple for authority** - Royalty, power, official
- ✅ **Red sparingly** - Only for destructive actions
- ✅ **High contrast** - WCAG AA compliant

---

### 📐 Typography

**Font Family:** System fonts
- macOS: -apple-system
- Windows: Segoe UI
- Fallback: Arial, sans-serif

**Hierarchy:**
- H1: 30px (Page titles)
- H2: 24px (Section headers)
- H3: 20px (Card titles)
- Body: 16px (Default text)
- Small: 14px (Captions, labels)

**UX Rationale:**
- ✅ **System fonts** - Fast loading, native feel
- ✅ **Clear hierarchy** - 4px increments (visual rhythm)
- ✅ **Readable sizes** - 16px minimum (accessibility)
- ✅ **Thai character support** - System fonts handle Thai well

---

### 🎯 Component Patterns

#### Buttons:
```
[Primary]   - Filled, high contrast (CTAs)
[Secondary] - Outlined, medium contrast (Alternate actions)
[Danger]    - Red, filled (Destructive actions)
[Disabled]  - Gray, low contrast (Inactive)
```

**UX Rationale:**
- ✅ **Size:** 48px height (mobile touch target)
- ✅ **Spacing:** 16px padding (breathing room)
- ✅ **Hover states** - Visual feedback
- ✅ **Loading states** - Prevents double-clicks

#### Form Fields:
```
[Label]     - Above input (clear association)
[Input]     - Large touch targets (48px height)
[Error]     - Below input, red text (proximity)
[Helper]    - Below input, gray text (guidance)
```

---

## 6. Micro-interactions

### ✨ Feedback Mechanisms

**1. Loading States:**
- Spinner + text (e.g., "กำลังโหลด...")
- Skeleton screens for lists
- Button disabled + spinner during submit

**2. Success States:**
- Green checkmark icon
- Success message (3s auto-dismiss)
- Confetti animation (optional, for voting success)

**3. Error States:**
- Red alert box with icon
- Specific error message (not generic)
- Clear action to fix (e.g., "Check your ID")

**4. Empty States:**
- Illustration + message
- Call-to-action button
- Example: "No parties yet. [Create first party]"

---

## 7. Accessibility (A11y)

### ♿ WCAG 2.1 AA Compliance

**Implemented:**
- ✅ **Keyboard navigation** - Tab through all interactive elements
- ✅ **Focus indicators** - Visible outline on focused elements
- ✅ **Color contrast** - 4.5:1 minimum for text
- ✅ **Alt text** - For all images (candidate photos, logos)
- ✅ **ARIA labels** - For icon-only buttons
- ✅ **Form labels** - All inputs have associated labels
- ✅ **Error identification** - Clear, specific error messages

**Screen Reader Support:**
- Role announcements ("button", "link", "form")
- State announcements ("disabled", "selected")
- Error announcements (live regions)

---

## 8. Mobile-First Considerations

### 📱 Responsive Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Touch-Friendly:
- **Minimum target size:** 48px × 48px
- **Spacing:** 8px between touch targets
- **No hover dependencies** - All actions accessible via tap

### Performance:
- **Lazy loading** - Images load on scroll
- **Code splitting** - Pages load on demand
- **Optimized images** - WebP format with fallbacks
- **Bundle size:** 130KB gzipped (fast loading)

---

## 9. Security UX

### 🔐 Trust Indicators

**1. Password Fields:**
- Masked by default
- Toggle visibility option
- Strength indicator (weak/medium/strong)

**2. Authentication:**
- JWT token (secure, stateless)
- Auto-logout on 401 error
- Clear "You've been logged out" message

**3. Confirmations:**
- Delete actions require confirmation
- Vote changes show "Are you sure?"
- Role changes immediate (but reversible)

---

## 10. Error Prevention & Recovery

### 🛡️ Prevention Strategies

**1. Form Validation:**
- Real-time validation (as user types)
- Disabled submit until valid
- Clear required field indicators

**2. Confirmation Dialogs:**
- Destructive actions (delete)
- Irreversible actions (close ballot)
- High-impact changes (role toggle)

**3. Undo/Reverse:**
- Vote changes allowed (until ballot closes)
- Role changes reversible
- Draft auto-save (future feature)

### 🔧 Recovery Mechanisms

**1. Graceful Degradation:**
- API failures show clear error messages
- Offline state detected and shown
- Retry buttons for failed actions

**2. Clear Error Messages:**
- Specific, not generic ("ID must be 13 digits" not "Invalid input")
- Actionable (tell user how to fix)
- Friendly tone (not blaming)

---

## 11. Performance UX

### ⚡ Perceived Performance

**1. Loading Indicators:**
- Immediate feedback on action
- Estimated time (if > 3s)
- Progress bars for multi-step

**2. Optimistic UI:**
- Assume success, revert on error
- Instant visual feedback
- Background sync

**3. Caching Strategy:**
- Constituencies cached (rarely change)
- Results cached per district
- User profile cached

---

## 12. Internationalization (i18n)

### 🌐 Thai Language Considerations

**1. Character Support:**
- System fonts support Thai
- Proper line-breaking
- No character clipping

**2. Cultural Patterns:**
- Formal language (ระบบ, กรุณา)
- Respectful forms (คุณ, ท่าน)
- Government-style formatting

**3. Number Formatting:**
- Thai comma separators (1,234)
- Buddhist calendar option (2569)
- Localized dates

---

## 13. Key UX Metrics

### 📊 Success Metrics

**1. Task Completion Rate:**
- Registration: > 90%
- Voting: > 95%
- Party creation (EC): > 85%

**2. Time on Task:**
- Registration: < 3 minutes
- Voting: < 1 minute
- Results browsing: < 2 minutes

**3. Error Rate:**
- Form validation errors: < 5%
- API errors: < 1%
- User confusion: < 2%

**4. User Satisfaction:**
- SUS Score: > 75 (Good)
- Net Promoter Score: > 50
- Task satisfaction: > 4/5

---

## 14. Recommendations for Future Iterations

### 🚀 Phase 2 Enhancements

**1. Personalization:**
- Remember last selected district
- Saved party preferences
- Notification preferences

**2. Advanced Features:**
- Compare candidates side-by-side
- Party policy search/filter
- Historical election data

**3. Accessibility:**
- High contrast mode
- Font size adjustment
- Text-to-speech integration

**4. Performance:**
- Progressive Web App (PWA)
- Offline voting capability
- Background sync

**5. Analytics:**
- Heatmap tracking
- User flow analysis
- A/B testing framework

---

## 15. Summary

### ✅ UX Strengths

1. **Clear Information Architecture** - Logical, predictable structure
2. **Role-Based Design** - Each persona has tailored experience
3. **Progressive Disclosure** - Complex data revealed gradually
4. **Mobile-First** - Responsive, touch-friendly
5. **Accessibility** - WCAG AA compliant
6. **Error Prevention** - Validation, confirmations, clear feedback
7. **Performance** - Fast loading, optimized bundle
8. **Thai Language** - Culturally appropriate, properly formatted

### 🎯 Design Philosophy

**"Democracy should be accessible, transparent, and trustworthy."**

Every UX decision supports these three pillars:
- **Accessible:** Simple forms, clear language, mobile-friendly
- **Transparent:** Show vote status, display results, clear processes
- **Trustworthy:** Secure authentication, confirmation dialogs, data integrity

---

**Prepared by:** UX Research Team  
**For:** SE713 Backend Development Project  
**Status:** Frontend 100% Complete, UX Documented
