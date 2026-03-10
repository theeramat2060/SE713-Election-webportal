# Design System: SE713 Online Election System
**Project ID:** [To be generated]

## 1. Visual Theme & Atmosphere
The SE713 Online Election System is designed to evoke **trust, transparency, and civic duty**. The interface is clean, professional, and authoritative, using a structured layout that prioritizes clarity and ease of use for all citizens.

The atmosphere is **official yet accessible**, avoiding unnecessary decorative elements to focus on the gravity of the electoral process. High contrast, clear typography, and generous touch targets ensure accessibility for a wide range of users.

**Key Characteristics:**
- Structured and predictable layouts
- Authoritative and official tone
- Clear visual feedback for all actions
- High readability and accessibility
- Strong semantic color usage (Democracy Green / Authority Purple)

## 2. Color Palette & Roles

### Primary Branding
- **Democracy Green** (#10B981) – Used for voter-facing actions, success states, and the primary "Go" button. Represents growth, permission, and the democratic process.
- **Authority Purple** (#9333EA) – Used for administrative (EC/Admin) headers, oversight functions, and official status. Represents royalty, power, and official governance.

### Foundation
- **Pristine White** (#FFFFFF) – Primary surface and background color.
- **Soft Governance Gray** (#F9FAF7) – Secondary background for subtle section separation.
- **Border Gray** (#E5E7EB) – Used for input borders and section dividers.

### Typography & Text
- **Near-Black Primary** (#111827) – Main body text and headlines for maximum legibility.
- **Muted Secondary** (#6B7280) – Supporting text, labels, and metadata.

### System Feedback
- **Success Green** (#10B981) – Confirmation of votes, successful registrations.
- **Error Red** (#EF4444) – Destructive actions, validation errors.
- **Warning Yellow** (#F59E0B) – Critical alerts, pending statuses.
- **Info Blue** (#3B82F6) – General information and navigation highlights.

## 3. Typography Rules
**Primary Font Family:** "Public Sans" (fallback: Inter, system-ui)
- **H1 (Page Titles):** 30px, Bold.
- **H2 (Section Headers):** 24px, Semi-bold.
- **Body Text:** 16px, Regular.
- **Labels/Small:** 14px, Medium.

## 4. Component Stylings
- **Buttons:** 8px rounded corners. Primary actions are filled with Democracy Green or Authority Purple.
- **Cards:** 8px rounded corners with subtle elevation shadows (`0 1px 3px 0 rgba(0, 0, 0, 0.05)`).
- **Inputs:** 8px rounded corners, 1px Border Gray, matching primary brand colors on focus.

## 5. Layout Principles
- **Grid:** Responsive grid with 1.5rem (24px) gutters.
- **Spacing:** Recursive 8px spacing system (8, 16, 24, 32, 48, 64).
- **Touch Targets:** Minimum 48px height for all interactive elements.

## 6. Design System Notes for Stitch Generation
When creating new screens for the Election Portal, use these instructions:
- **Atmosphere:** "Professional, authoritative, and trustworthy."
- **Colors:** Use "Democracy Green (#10B981)" for voter actions and "Authority Purple (#9333EA)" for administrative interfaces.
- **Rounding:** Use "Standard 8px rounded corners" for all components.
- **Typography:** Use "Public Sans" style headings with clear weight hierarchy.
- **Buttons:** "Large, accessible buttons with 8px rounding."
