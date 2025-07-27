# Data Models & Database Schema

## Database Design Philosophy

- **PostgreSQL**: Main relational data (users, appointments, prescriptions)
- **MongoDB**: Document storage for EHR, medical files, and unstructured data
- **Redis**: Caching, sessions, real-time features

## Core Data Models

### 1. User Management

```sql
-- Users table (PostgreSQL)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    status user_status NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    profile_completed BOOLEAN DEFAULT FALSE
);

-- User roles enum
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin', 'nurse', 'receptionist');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender gender_type,
    avatar_url TEXT,
    address JSONB, -- Flexible address structure
    emergency_contact JSONB,
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Africa/Lagos',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
```

### 2. Doctor Profiles & Specialties

```sql
-- Medical specialties
CREATE TABLE medical_specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- Doctor profiles
CREATE TABLE doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    medical_degree VARCHAR(200),
    years_of_experience INTEGER DEFAULT 0,
    consultation_fee DECIMAL(10,2),
    bio TEXT,
    consultation_duration INTEGER DEFAULT 30, -- minutes
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available_online BOOLEAN DEFAULT TRUE,
    clinic_id UUID REFERENCES clinics(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctor specialties (many-to-many)
CREATE TABLE doctor_specialties (
    doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES medical_specialties(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, specialty_id)
);

-- Doctor availability
CREATE TABLE doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    break_start_time TIME,
    break_end_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Clinics & Locations

```sql
-- Clinics
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    address JSONB NOT NULL,
    coordinates POINT, -- For location-based search
    operating_hours JSONB,
    services JSONB, -- Array of services offered
    license_number VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic staff (doctors, nurses, receptionists)
CREATE TABLE clinic_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role staff_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(clinic_id, user_id)
);

CREATE TYPE staff_role AS ENUM ('doctor', 'nurse', 'receptionist', 'admin');
```

### 4. Appointments

```sql
-- Appointment types
CREATE TABLE appointment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL DEFAULT 30, -- minutes
    price DECIMAL(10,2),
    is_online_available BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id),
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id),
    clinic_id UUID REFERENCES clinics(id),
    appointment_type_id UUID REFERENCES appointment_types(id),
    
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    status appointment_status DEFAULT 'pending',
    consultation_type consultation_type DEFAULT 'in_person',
    
    chief_complaint TEXT,
    notes TEXT,
    
    -- Payment
    fee DECIMAL(10,2),
    payment_status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    
    -- Virtual consultation
    meeting_link TEXT,
    meeting_id VARCHAR(100),
    
    -- Tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

CREATE TYPE appointment_status AS ENUM (
    'pending', 'confirmed', 'in_progress', 'completed', 
    'cancelled', 'no_show', 'rescheduled'
);

CREATE TYPE consultation_type AS ENUM ('in_person', 'video_call', 'phone_call', 'chat');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
```

### 5. Prescriptions & Medications

```sql
-- Medications database
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    brand_names TEXT[], -- Array of brand names
    category VARCHAR(100),
    description TEXT,
    contraindications TEXT,
    side_effects TEXT,
    dosage_forms TEXT[], -- tablet, capsule, syrup, etc.
    strength_options TEXT[], -- 250mg, 500mg, etc.
    requires_prescription BOOLEAN DEFAULT TRUE,
    is_controlled_substance BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id),
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id),
    appointment_id UUID REFERENCES appointments(id),
    clinic_id UUID REFERENCES clinics(id),
    
    prescription_number VARCHAR(50) UNIQUE NOT NULL,
    diagnosis TEXT NOT NULL,
    notes TEXT,
    
    status prescription_status DEFAULT 'active',
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    
    -- Digital signature
    doctor_signature TEXT, -- Base64 encoded signature
    digital_signature_hash VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE prescription_status AS ENUM ('active', 'completed', 'cancelled', 'expired');

-- Prescription items (medications in a prescription)
CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medications(id),
    
    medication_name VARCHAR(200) NOT NULL, -- Snapshot at time of prescription
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    quantity INTEGER,
    instructions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Electronic Health Records (MongoDB)

```javascript
// MongoDB EHR Schema
const EHRSchema = {
  _id: ObjectId,
  patientId: String, // UUID from PostgreSQL
  doctorId: String,  // UUID from PostgreSQL
  clinicId: String,  // UUID from PostgreSQL
  
  // Visit information
  visitDate: Date,
  visitType: String, // 'routine', 'emergency', 'follow_up', 'consultation'
  
  // Vital signs
  vitals: {
    temperature: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    respiratoryRate: Number,
    weight: Number,
    height: Number,
    bmi: Number,
    oxygenSaturation: Number
  },
  
  // Medical history
  medicalHistory: {
    allergies: [String],
    chronicConditions: [String],
    surgicalHistory: [String],
    familyHistory: [String],
    socialHistory: {
      smoking: String,
      alcohol: String,
      exercise: String,
      occupation: String
    }
  },
  
  // Current visit
  currentVisit: {
    chiefComplaint: String,
    historyOfPresentIllness: String,
    physicalExamination: String,
    assessment: String,
    plan: String,
    followUpInstructions: String
  },
  
  // Attachments
  attachments: [{
    type: String, // 'lab_result', 'xray', 'report', 'image'
    filename: String,
    fileUrl: String,
    uploadedAt: Date,
    description: String
  }],
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean,
  
  // Compliance
  accessLog: [{
    userId: String,
    action: String,
    timestamp: Date,
    ipAddress: String
  }]
};
```

### 7. Notifications & Communications

```sql
-- Notification templates
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type notification_type NOT NULL,
    subject VARCHAR(200),
    content TEXT NOT NULL,
    variables JSONB, -- Template variables
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM ('email', 'sms', 'push', 'in_app');

-- User notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    data JSONB, -- Additional data
    
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    email_appointments BOOLEAN DEFAULT TRUE,
    email_prescriptions BOOLEAN DEFAULT TRUE,
    email_reminders BOOLEAN DEFAULT TRUE,
    email_marketing BOOLEAN DEFAULT FALSE,
    
    sms_appointments BOOLEAN DEFAULT TRUE,
    sms_prescriptions BOOLEAN DEFAULT FALSE,
    sms_reminders BOOLEAN DEFAULT TRUE,
    sms_marketing BOOLEAN DEFAULT FALSE,
    
    push_appointments BOOLEAN DEFAULT TRUE,
    push_prescriptions BOOLEAN DEFAULT TRUE,
    push_reminders BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);
```

### 8. Inventory Management

```sql
-- Inventory items
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    medication_id UUID REFERENCES medications(id),
    
    item_name VARCHAR(200) NOT NULL,
    item_code VARCHAR(50),
    category VARCHAR(100),
    unit_of_measure VARCHAR(50),
    
    current_stock INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    maximum_stock INTEGER,
    
    unit_cost DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    
    supplier_name VARCHAR(200),
    supplier_contact VARCHAR(100),
    
    expiry_date DATE,
    batch_number VARCHAR(100),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock movements
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
    
    movement_type movement_type NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    
    reference_type VARCHAR(50), -- 'purchase', 'sale', 'adjustment', 'expired'
    reference_id UUID, -- ID of related record
    
    notes TEXT,
    performed_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE movement_type AS ENUM ('in', 'out', 'adjustment');
```

### 9. Analytics & Reporting

```sql
-- System analytics
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    
    properties JSONB,
    context JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic performance metrics
CREATE TABLE clinic_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    date DATE NOT NULL,
    
    total_appointments INTEGER DEFAULT 0,
    completed_appointments INTEGER DEFAULT 0,
    cancelled_appointments INTEGER DEFAULT 0,
    no_show_appointments INTEGER DEFAULT 0,
    
    total_prescriptions INTEGER DEFAULT 0,
    total_patients INTEGER DEFAULT 0,
    new_patients INTEGER DEFAULT 0,
    
    revenue DECIMAL(12,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(clinic_id, date)
);
```

## Indexes for Performance

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Appointment indexes
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_clinic ON appointments(clinic_id);

-- Prescription indexes
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_number ON prescriptions(prescription_number);
CREATE INDEX idx_prescriptions_date ON prescriptions(issued_date);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Geographic index for clinics
CREATE INDEX idx_clinics_location ON clinics USING GIST(coordinates);
```

## Data Relationships Summary

```
Users (1) → (1) UserProfiles
Users (1) → (0..1) DoctorProfiles
Users (1) → (0..*) Appointments [as patient]
DoctorProfiles (1) → (0..*) Appointments [as doctor]
DoctorProfiles (*) ↔ (*) MedicalSpecialties
Clinics (1) → (0..*) DoctorProfiles
Clinics (1) → (0..*) Appointments
Appointments (1) → (0..*) Prescriptions
Prescriptions (1) → (1..*) PrescriptionItems
Medications (1) → (0..*) PrescriptionItems
Users (1) → (0..*) Notifications
Clinics (1) → (0..*) InventoryItems
```

This schema provides a robust foundation for the medical appointment system with proper normalization, performance optimization, and scalability considerations.
