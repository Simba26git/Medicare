# MedCare Project Structure

## Frontend Application (`/frontend`)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI elements (Button, Input, etc.)
│   │   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   │   ├── forms/          # Form components
│   │   └── charts/         # Chart and visualization components
│   ├── pages/              # Next.js pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── appointments/   # Appointment management
│   │   ├── prescriptions/  # Prescription management
│   │   └── admin/          # Admin panel
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles and themes
│   ├── types/              # TypeScript type definitions
│   └── lib/                # Third-party integrations
├── public/                 # Static assets
├── docs/                   # Frontend documentation
├── tests/                  # Test files
└── package.json
```

## Backend API (`/backend`)
```
backend/
├── src/
│   ├── controllers/        # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── appointment.controller.ts
│   │   ├── prescription.controller.ts
│   │   └── admin.controller.ts
│   ├── services/           # Business logic
│   │   ├── auth.service.ts
│   │   ├── email.service.ts
│   │   ├── sms.service.ts
│   │   ├── ai.service.ts
│   │   └── notification.service.ts
│   ├── models/             # Database models
│   │   ├── user.model.ts
│   │   ├── appointment.model.ts
│   │   ├── prescription.model.ts
│   │   └── clinic.model.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/             # API routes
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── appointments.routes.ts
│   │   └── prescriptions.routes.ts
│   ├── database/           # Database configuration
│   │   ├── migrations/     # Database migrations
│   │   ├── seeds/          # Database seeds
│   │   └── config.ts       # Database config
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   └── config/             # Application configuration
├── tests/                  # Test files
├── docs/                   # API documentation
└── package.json
```

## Shared Package (`/shared`)
```
shared/
├── src/
│   ├── types/              # Shared TypeScript types
│   │   ├── user.types.ts
│   │   ├── appointment.types.ts
│   │   ├── prescription.types.ts
│   │   └── api.types.ts
│   ├── utils/              # Shared utility functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   ├── schemas/            # Validation schemas
│   │   ├── user.schema.ts
│   │   ├── appointment.schema.ts
│   │   └── prescription.schema.ts
│   └── index.ts            # Main export file
├── tests/
└── package.json
```

## Mobile Application (`/mobile`)
```
mobile/
├── src/
│   ├── components/         # React Native components
│   ├── screens/            # Screen components
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Appointments/
│   │   └── Prescriptions/
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API services
│   ├── hooks/              # Custom hooks
│   ├── contexts/           # React contexts
│   ├── utils/              # Utility functions
│   ├── styles/             # Styling
│   └── types/              # TypeScript types
├── assets/                 # Images, fonts, etc.
├── android/                # Android-specific files
├── ios/                    # iOS-specific files
└── package.json
```

## Documentation (`/docs`)
```
docs/
├── api/                    # API documentation
│   ├── authentication.md
│   ├── users.md
│   ├── appointments.md
│   └── prescriptions.md
├── deployment/             # Deployment guides
│   ├── aws.md
│   ├── docker.md
│   └── kubernetes.md
├── development/            # Development guides
│   ├── setup.md
│   ├── coding-standards.md
│   └── testing.md
├── architecture/           # Architecture documentation
│   ├── system-design.md
│   ├── database-design.md
│   └── security.md
└── user-guides/            # User documentation
    ├── patient-guide.md
    ├── doctor-guide.md
    └── admin-guide.md
```

## Infrastructure (`/infrastructure`)
```
infrastructure/
├── docker/                 # Docker configurations
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── Dockerfile.nginx
├── kubernetes/             # Kubernetes manifests
│   ├── backend.yaml
│   ├── frontend.yaml
│   ├── database.yaml
│   └── ingress.yaml
├── terraform/              # Infrastructure as Code
│   ├── aws/
│   ├── gcp/
│   └── azure/
├── scripts/                # Deployment scripts
│   ├── deploy.sh
│   ├── backup.sh
│   └── migrate.sh
└── monitoring/             # Monitoring configuration
    ├── prometheus.yml
    ├── grafana/
    └── alerts/
```

## Configuration Files (Root Level)
```
/
├── .github/                # GitHub workflows
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── security.yml
├── .vscode/                # VS Code configuration
│   ├── settings.json
│   ├── launch.json
│   └── extensions.json
├── nginx/                  # Nginx configuration
│   ├── nginx.conf
│   ├── ssl/
│   └── sites-available/
├── scripts/                # Root-level scripts
│   ├── setup.sh
│   ├── install.sh
│   └── clean.sh
├── docker-compose.dev.yml  # Development environment
├── docker-compose.prod.yml # Production environment
├── package.json            # Root package.json
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── .dockerignore           # Docker ignore rules
├── README.md               # Project documentation
├── CONTRIBUTING.md         # Contribution guidelines
├── LICENSE                 # License file
└── CHANGELOG.md            # Change log
```

## Key Folders Explained

### `/frontend/src/components/`
Reusable UI components organized by type:
- `ui/` - Basic components (buttons, inputs, modals)
- `layout/` - Layout-specific components
- `forms/` - Form components with validation
- `charts/` - Data visualization components

### `/backend/src/services/`
Business logic separated from controllers:
- Authentication and authorization
- Email and SMS notifications
- AI integration services
- Payment processing
- File management

### `/shared/`
Common code shared between frontend and backend:
- TypeScript type definitions
- Validation schemas
- Utility functions
- Constants and configurations

### `/docs/`
Comprehensive documentation:
- API documentation with examples
- Deployment guides for different platforms
- Development setup instructions
- Architecture and design decisions

### `/infrastructure/`
DevOps and deployment configurations:
- Docker containers for services
- Kubernetes manifests for orchestration
- Terraform for infrastructure provisioning
- Monitoring and logging setup

This structure follows industry best practices and supports:
- **Scalability**: Clear separation of concerns
- **Maintainability**: Organized code structure
- **Collaboration**: Clear documentation and guidelines
- **Deployment**: Automated CI/CD pipelines
- **Monitoring**: Built-in observability
