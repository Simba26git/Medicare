# 🏥 MedCare - Complete Medical Platform

<div align="center">

![MedCare Logo](https://img.shields.io/badge/MedCare-Medical%20Platform-blue?style=for-the-badge&logo=medical-cross)

**A comprehensive digital healthcare platform with appointment booking, prescription management, and role-based dashboards**

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🚀 Live Demo](#-live-demo) • [📖 Documentation](#-documentation) • [🛠 Installation](#-installation) • [🌐 Deployment](#-deployment)

</div>

## 🌟 Features

### 🏥 **Complete Healthcare Management**
- **Multi-role Authentication** - Patient, Doctor, and Admin portals
- **Appointment Booking** - Calendar-based scheduling with availability checking
- **Prescription Management** - Digital prescriptions with upload capabilities
- **Medical Records** - Comprehensive patient data management
- **Real-time Notifications** - Instant updates and reminders

### 🎨 **Modern User Experience**
- **Responsive Design** - Mobile-first approach for all devices
- **Professional UI** - Clean, medical-grade interface design
- **Dark/Light Themes** - User preference support
- **Accessibility** - WCAG 2.1 compliant design
- **Progressive Web App** - Offline capabilities and app-like experience

### 🔐 **Security & Compliance**
- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Granular permissions system
- **Data Encryption** - All sensitive data encrypted
- **HIPAA-Ready** - Healthcare compliance standards
- **Audit Trails** - Complete action logging

## 🚀 Live Demo

### 🌐 **Access the Platform**
- **Local Development**: http://localhost:3000
- **API Documentation**: http://localhost:3001/api

### 🔑 **Demo Credentials**

| Role | Email | Password |
|------|-------|----------|
| **Patient** | patient@medcare.com | patient123 |
| **Doctor** | doctor@medcare.com | doctor123 |
| **Admin** | admin@medcare.com | admin123 |

## 🛠 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/medcare-platform.git
cd medcare-platform

# Install dependencies
npm install

# Start backend server
cd backend
npm install
npm start
# Backend runs on http://localhost:3001

# Start frontend (new terminal)
cd ../frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### Environment Setup

1. **Backend Environment** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key
API_VERSION=1.0.0
```

2. **Frontend Environment** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=MedCare
NEXT_PUBLIC_ENVIRONMENT=development
```

## 🏗 Architecture

### 📁 **Project Structure**
```
medcare-platform/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── index.ts        # Main server file
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Authentication & validation
│   └── package.json
├── frontend/               # Next.js React application
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── utils/          # Utilities & API service
│   │   └── styles/         # Styling files
│   └── package.json
├── docs/                   # Documentation
└── README.md
```

### 🔧 **Technology Stack**

**Frontend:**
- Next.js 14 with React 18
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for API communication
- React Hook Form for form management

**Backend:**
- Node.js with Express.js
- TypeScript for type safety
- JWT for authentication
- CORS for cross-origin requests
- Helmet for security headers

**Development:**
- ESLint & Prettier for code quality
- Hot reload for development
- Environment-based configuration

## 🌐 Deployment

### 🚀 **Vercel (Recommended)**

**Quick Deploy:**
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy automatically

```bash
# Using Vercel CLI
npm install -g vercel
cd frontend
vercel
```

**Environment Variables for Vercel:**
```
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com/api
NEXT_PUBLIC_APP_NAME=MedCare
NEXT_PUBLIC_ENVIRONMENT=production
```

### 📖 **Deployment Guides**
- 📋 [Quick Vercel Deploy](./QUICK_DEPLOY_VERCEL.md) - 3-step deployment
- 📖 [Complete Vercel Guide](./VERCEL_DEPLOYMENT.md) - Detailed instructions
- 📄 [Netlify Alternative](./NETLIFY_DEPLOYMENT.md) - Alternative platform

### 🔧 **Backend Deployment Options**
- **Heroku** - `git push heroku main`
- **Railway** - One-click GitHub integration
- **Render** - Free tier with auto-builds

## 📱 Platform Overview

### 👥 **Patient Portal**
- **Dashboard** - Appointment overview and quick actions
- **Book Appointments** - Calendar-based scheduling
- **Medical Records** - View test results and history
- **Prescriptions** - Upload and manage prescriptions
- **Profile Management** - Update personal information

### 👩‍⚕️ **Doctor Portal**
- **Patient Management** - View and manage patient records
- **Appointment Scheduling** - Manage daily schedule
- **Prescription Creation** - Digital prescription writing
- **Medical Records** - Update patient information
- **Dashboard Analytics** - Patient and appointment insights

### 👨‍💼 **Admin Portal**
- **User Management** - Add, edit, and manage users
- **System Analytics** - Platform usage statistics
- **Appointment Oversight** - System-wide appointment management
- **Settings** - Configure platform settings
- **Reports** - Generate system reports

## 🎯 Key Features Breakdown

### 📅 **Appointment System**
- **Calendar Interface** - Visual appointment booking
- **Availability Checking** - Real-time slot availability
- **Conflict Prevention** - Automatic scheduling validation
- **Reminder System** - Automated appointment reminders
- **Rescheduling** - Easy appointment modifications

### 💊 **Prescription Management**
- **Digital Prescriptions** - Paperless prescription creation
- **Upload System** - Prescription image upload
- **History Tracking** - Complete prescription history
- **Drug Interaction Checking** - Safety validations
- **Print/Export** - PDF generation for prescriptions

### 🔔 **Notification System**
- **Real-time Updates** - Instant notifications
- **Email Integration** - Automated email notifications
- **Badge Counters** - Unread notification indicators
- **Customizable Alerts** - User-defined notification preferences
- **Action Buttons** - Quick actions from notifications

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run integration tests
npm run test:integration
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the healthcare community
- Inspired by modern healthcare digital transformation
- Thanks to all contributors and testers

## 📞 Support

- 📧 Email: support@medcare.com
- 💬 Discord: [Join our community](https://discord.gg/medcare)
- 📚 Documentation: [Full docs](./docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/medcare-platform/issues)

---

<div align="center">

**Made with ❤️ for Healthcare Providers**

[⬆ Back to Top](#-medcare---complete-medical-platform)

</div>
