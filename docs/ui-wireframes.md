# UI/UX Design & Wireframes

## Design Philosophy

### Mobile-First Approach
- **Primary Device**: Smartphone (iOS/Android)
- **Secondary**: Tablet, Desktop
- **Touch-Friendly**: Large buttons, easy navigation
- **One-Handed Use**: Key actions accessible with thumb

### African Context Considerations
- **Low Data Usage**: Compressed images, minimal animations
- **Offline Capability**: Core features work without internet
- **Multilingual**: Support for local languages
- **Cultural Sensitivity**: Appropriate colors, imagery, and terminology

### Design Principles
- **Simplicity**: Clean, uncluttered interface
- **Accessibility**: WCAG 2.1 AA compliance
- **Trust**: Professional appearance, clear data privacy
- **Speed**: Fast loading, responsive interactions

## Color Palette

```css
/* Primary Colors */
--primary-blue: #2563EB;      /* Professional, trustworthy */
--primary-green: #059669;     /* Health, success */
--primary-teal: #0D9488;      /* Calming, medical */

/* Secondary Colors */
--secondary-blue: #EFF6FF;    /* Light backgrounds */
--secondary-green: #ECFDF5;   /* Success states */
--secondary-orange: #FFF7ED;  /* Warnings */
--secondary-red: #FEF2F2;     /* Errors */

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-500: #6B7280;
--gray-700: #374151;
--gray-900: #111827;

/* Status Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

## Typography

```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Layout System

### Grid System
```css
/* Mobile: 4 columns, 16px gutters */
/* Tablet: 8 columns, 20px gutters */
/* Desktop: 12 columns, 24px gutters */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .container { padding: 0 1.25rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 1.5rem; }
}
```

### Spacing Scale
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
```

## UI Components

### Button System
```
┌─────────────────────┐
│ Primary Button      │  ← Main actions (Book, Save, Submit)
├─────────────────────┤
│ Secondary Button    │  ← Alternative actions (Cancel, Back)
├─────────────────────┤
│ Outline Button      │  ← Tertiary actions (Edit, View)
├─────────────────────┤
│ Text Button         │  ← Minimal actions (Skip, Learn More)
└─────────────────────┘

Sizes: Small (32px), Medium (40px), Large (48px)
States: Default, Hover, Active, Disabled, Loading
```

### Form Elements
```
┌─────────────────────┐
│ Input Field         │
├─────────────────────┤
│ Dropdown/Select     │
├─────────────────────┤
│ Checkbox/Radio      │
├─────────────────────┤
│ Date/Time Picker    │
├─────────────────────┤
│ File Upload         │
└─────────────────────┘

States: Default, Focus, Error, Disabled, Success
Labels: Always visible, never placeholder-only
Error Messages: Below field, specific and helpful
```

## Page Layouts & Wireframes

### 1. Patient Dashboard (Mobile)

```
┌─────────────────────────────────┐
│ ☰  MedCare        🔔 👤        │ ← Header with menu, notifications, profile
├─────────────────────────────────┤
│ Welcome back, Sarah! 👋         │ ← Personalized greeting
│ Your next appointment:          │
│ ┌─────────────────────────────┐ │
│ │ Dr. Adamu - Cardiology      │ │ ← Next appointment card
│ │ Today, 2:30 PM              │ │
│ │ [Join Video Call] [Details] │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Quick Actions                   │
│ ┌───────┐ ┌───────┐ ┌───────┐  │ ← Action grid
│ │ 📅     │ │ 💊     │ │ 📋     │  │
│ │ Book   │ │ Rx     │ │ Records│  │
│ └───────┘ └───────┘ └───────┘  │
│ ┌───────┐ ┌───────┐ ┌───────┐  │
│ │ 💬     │ │ 🔍     │ │ 📞     │  │
│ │ Chat   │ │ Find   │ │ Emergency│
│ └───────┘ └───────┘ └───────┘  │
├─────────────────────────────────┤
│ Recent Activity                 │
│ • Prescription received         │ ← Timeline
│ • Lab results available         │
│ • Appointment confirmed         │
└─────────────────────────────────┘
```

### 2. Doctor Dashboard (Mobile)

```
┌─────────────────────────────────┐
│ ☰  MedCare        🔔 👤        │
├─────────────────────────────────┤
│ Good morning, Dr. Adamu 👨‍⚕️    │
│                                 │
│ Today's Schedule (8 patients)   │
│ ┌─────────────────────────────┐ │
│ │ 9:00 AM - Sarah M.          │ │ ← Today's appointments
│ │ Routine Checkup    [Start]  │ │
│ ├─────────────────────────────┤ │
│ │ 9:30 AM - John D.           │ │
│ │ Follow-up         [Start]   │ │
│ │ ... 6 more                  │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Quick Actions                   │
│ ┌───────┐ ┌───────┐ ┌───────┐  │
│ │ 📋     │ │ 💊     │ │ 📊     │  │
│ │ Patients│ │ Prescribe│ │ Reports│
│ └───────┘ └───────┘ └───────┘  │
├─────────────────────────────────┤
│ Notifications (3)               │
│ • New patient registration      │
│ • Prescription refill request   │
│ • Appointment cancellation     │
└─────────────────────────────────┘
```

### 3. Appointment Booking Flow (Mobile)

#### Step 1: Select Doctor
```
┌─────────────────────────────────┐
│ ← Book Appointment              │
├─────────────────────────────────┤
│ Find a Doctor                   │
│ ┌─────────────────────────────┐ │
│ │ 🔍 Search specialty or name │ │
│ └─────────────────────────────┘ │
│                                 │
│ Specialties                     │
│ ┌─────────┐ ┌─────────┐         │
│ │ General │ │ Cardio  │ ...     │
│ └─────────┘ └─────────┘         │
│                                 │
│ Recommended Doctors             │
│ ┌─────────────────────────────┐ │
│ │ 👨‍⚕️ Dr. Adamu Bello          │ │
│ │ ⭐ 4.8 • Cardiologist       │ │
│ │ 💰 ₦5,000 • 📍 Lagos       │ │
│ │ [View Profile] [Book Now]   │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 👩‍⚕️ Dr. Fatima Ahmed        │ │
│ │ ⭐ 4.9 • General Practice   │ │
│ │ 💰 ₦3,500 • 📍 Abuja       │ │
│ │ [View Profile] [Book Now]   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### Step 2: Select Date & Time
```
┌─────────────────────────────────┐
│ ← Dr. Adamu Bello               │
├─────────────────────────────────┤
│ Select Date                     │
│ ┌─────────────────────────────┐ │
│ │  < February 2025 >          │ │
│ │ S  M  T  W  T  F  S         │ │
│ │          1  2  3  4         │ │
│ │ 5  6  7  8  9 10 11         │ │
│ │12 13 14 [15] 16 17 18       │ │ ← Selected date highlighted
│ │19 20 21 22 23 24 25         │ │
│ └─────────────────────────────┘ │
│                                 │
│ Available Times - Feb 15        │
│ ┌─────────┐ ┌─────────┐         │
│ │ 9:00 AM │ │ 9:30 AM │ ...     │ ← Available slots
│ └─────────┘ └─────────┘         │
│ ┌─────────┐ ┌─────────┐         │
│ │ 2:00 PM │ │ 2:30 PM │ ...     │
│ └─────────┘ └─────────┘         │
│                                 │
│ Consultation Type               │
│ ○ In-person visit               │
│ ● Video consultation (+₦500)    │ ← Selected option
│ ○ Phone consultation            │
│                                 │
│ [Continue to Payment]           │
└─────────────────────────────────┘
```

### 4. Prescription View (Mobile)

```
┌─────────────────────────────────┐
│ ← Prescription #RX-2025-001     │
├─────────────────────────────────┤
│ Dr. Adamu Bello                 │
│ Cardiology Specialist           │
│ Lagos Medical Center            │
│ ┌─────────────────────────────┐ │
│ │ [Download PDF] [Share] [💾] │ │ ← Action buttons
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Patient: Sarah Musa             │
│ Date: Feb 15, 2025              │
│ Diagnosis: Hypertension         │
├─────────────────────────────────┤
│ Medications:                    │
│                                 │
│ 1. Amlodipine 5mg               │
│    💊 Tablet                    │
│    🕐 Once daily (morning)      │
│    📅 30 days                   │
│    ℹ️ Take with food            │
│                                 │
│ 2. Lisinopril 10mg              │
│    💊 Tablet                    │
│    🕐 Once daily (evening)      │
│    📅 30 days                   │
│    ⚠️ Monitor blood pressure    │
├─────────────────────────────────┤
│ Doctor's Notes:                 │
│ Follow up in 2 weeks. Monitor   │
│ BP daily. Reduce salt intake.   │
│ Exercise regularly.             │
├─────────────────────────────────┤
│ Valid until: Mar 15, 2025       │
│ Status: ✅ Active               │
│                                 │
│ [Set Reminders] [Refill Request]│
└─────────────────────────────────┘
```

### 5. Doctor's Consultation Interface (Tablet/Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ MedCare - Consultation with Sarah Musa                  [×]     │
├─────────────────────┬───────────────────────────────────────────┤
│ Patient Info        │ Video Call                                │
│ ┌─────────────────┐ │ ┌─────────────────────────────────────┐   │
│ │ 👤 Sarah Musa   │ │ │                                     │   │
│ │ 📧 Age: 34      │ │ │         [Video Window]              │   │
│ │ 🩸 O+           │ │ │                                     │   │
│ │ ⚡ Allergies:   │ │ │                                     │   │
│ │   • Penicillin  │ │ └─────────────────────────────────────┘   │
│ │ 📋 Conditions:  │ │ [🎤] [📹] [📞] [💬] [📋] [🖥️]           │
│ │   • Hypertension│ │                                           │
│ └─────────────────┘ │ Chief Complaint                           │
│                     │ ┌─────────────────────────────────────┐   │
│ Recent Vitals       │ │ Chest pain and shortness of breath │   │
│ ┌─────────────────┐ │ │ for the past 2 days...             │   │
│ │ BP: 140/90      │ │ └─────────────────────────────────────┘   │
│ │ HR: 72 bpm      │ │                                           │
│ │ Temp: 98.6°F    │ │ Assessment & Plan                         │
│ │ Weight: 70kg    │ │ ┌─────────────────────────────────────┐   │
│ └─────────────────┘ │ │ [Type diagnosis and treatment plan] │   │
│                     │ └─────────────────────────────────────┘   │
│ Previous Visits     │                                           │
│ • Feb 1: Routine    │ [📝 Add to EHR] [💊 Prescribe] [📅 Book] │
│ • Jan 15: Follow-up │                                           │
│ • Dec 10: Emergency │                                           │
│                     │                                           │
│ [📁 Full History]   │                                           │
└─────────────────────┴───────────────────────────────────────────┘
```

### 6. Admin Dashboard (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ MedCare Admin Dashboard                          👤 Admin User  │
├─────────────────────────────────────────────────────────────────┤
│ Overview                                           📅 Today     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│ │ 👥      │ │ 📅      │ │ 💊      │ │ 💰      │                │
│ │ 1,234   │ │ 89      │ │ 156     │ │ ₦1.2M   │                │
│ │ Patients│ │ Appts   │ │ Rx      │ │ Revenue │                │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                │
├─────────────────────────────────────────────────────────────────┤
│ Recent Activity                 │ System Alerts                 │
│ ┌─────────────────────────────┐ │ ┌─────────────────────────────┐ │
│ │ 👨‍⚕️ Dr. Adamu joined       │ │ │ ⚠️ Server load high (89%)  │ │
│ │ 👤 50 new patients today   │ │ │ 🔒 Failed login attempts    │ │
│ │ 💊 Low inventory: Aspirin  │ │ │ 📊 Daily backup completed   │ │
│ │ 📅 45 appointments booked  │ │ │ 🔔 3 pending verifications  │ │
│ └─────────────────────────────┘ │ └─────────────────────────────┘ │
├─────────────────────────────────┼─────────────────────────────────┤
│ Top Performing Doctors          │ Revenue Trend (30 days)        │
│ 1. Dr. Fatima Ahmed - ⭐ 4.9   │ ┌─────────────────────────────┐ │
│ 2. Dr. Adamu Bello - ⭐ 4.8    │ │        [Revenue Chart]      │ │
│ 3. Dr. Kemi Johnson - ⭐ 4.7   │ │                             │ │
│                                 │ └─────────────────────────────┘ │
└─────────────────────────────────┴─────────────────────────────────┘
```

## Mobile Navigation Patterns

### Bottom Tab Navigation (Primary)
```
┌─────────────────────────────────┐
│                                 │
│        Main Content Area        │
│                                 │
├─────────────────────────────────┤
│ 🏠   📅   💊   💬   👤         │ ← Bottom tabs
│Home Appts  Rx  Chat Profile    │
└─────────────────────────────────┘
```

### Hamburger Menu (Secondary)
```
┌─────────────────────────────────┐
│ ☰  MedCare            🔔 👤    │
│                                 │
│ When hamburger is tapped:       │
│ ┌─────────────────┐             │
│ │ 🏠 Dashboard    │             │
│ │ 👥 My Doctors   │             │
│ │ 📋 Health Records│            │
│ │ 🔍 Find Doctors │             │
│ │ ⚙️ Settings     │             │
│ │ ❓ Help & Support│            │
│ │ 🚪 Logout       │             │
│ └─────────────────┘             │
└─────────────────────────────────┘
```

## Responsive Breakpoints

```css
/* Mobile First */
.container {
  padding: 1rem;
}

/* Small tablets */
@media (min-width: 640px) {
  .container {
    padding: 1.5rem;
  }
}

/* Large tablets */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 768px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 2.5rem;
    max-width: 1024px;
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

## Accessibility Features

### Screen Reader Support
- Semantic HTML elements
- ARIA labels and descriptions
- Proper heading hierarchy
- Alt text for images

### Keyboard Navigation
- Tab order follows logical flow
- Enter/Space for button activation
- Escape to close modals
- Arrow keys for menu navigation

### Visual Accessibility
- High contrast mode support
- Text scaling up to 200%
- Focus indicators
- Color is not the only indicator

### Motor Accessibility
- Large touch targets (44px minimum)
- No time-based actions
- Gesture alternatives
- Voice input support

## Performance Optimizations

### Image Strategy
- WebP format with fallbacks
- Responsive images with srcset
- Lazy loading for non-critical images
- Progressive JPEG for photos

### Font Loading
```css
@font-face {
  font-family: 'Inter';
  font-display: swap; /* Improves loading performance */
  src: url('/fonts/inter.woff2') format('woff2');
}
```

### CSS Strategy
- Critical CSS inlined
- Non-critical CSS loaded asynchronously
- CSS Grid and Flexbox for layouts
- CSS custom properties for theming

This design system provides a solid foundation for building a modern, accessible, and mobile-optimized medical platform that works well in the African context.
