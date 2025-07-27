# Quick Setup Guide

## Prerequisites

Before setting up the MedCare platform, ensure you have the following installed:

- **Node.js** 18+ and npm 9+
- **Docker** and Docker Compose
- **Git**
- **PostgreSQL** 15+ (optional if using Docker)
- **Redis** 7+ (optional if using Docker)

## 🚀 Quick Start (5 minutes)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/medcare-africa/platform.git
cd platform

# Install dependencies for all packages
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` file with your settings:

```env
# Minimal required settings for development
DATABASE_URL=postgresql://medcare:medcare_dev_password@localhost:5432/medcare_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Optional: Add API keys for full functionality
OPENAI_API_KEY=your_openai_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

### 3. Start with Docker (Recommended)

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/docs
- Admin Panel: http://localhost:3000/admin

### 4. Alternative: Manual Setup

If you prefer not to use Docker:

```bash
# Start PostgreSQL and Redis (or use cloud services)
# Update .env with your database URLs

# Install and start backend
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev

# In another terminal, start frontend
cd frontend
npm install
npm run dev
```

## 🔑 Default Login Credentials

After seeding the database:

**Admin User:**
- Email: admin@medcare.africa
- Password: Admin123!

**Doctor User:**
- Email: doctor@medcare.africa
- Password: Doctor123!

**Patient User:**
- Email: patient@medcare.africa
- Password: Patient123!

## 📱 Mobile Setup (Optional)

### React Native Setup

```bash
cd mobile

# Install dependencies
npm install

# iOS (requires Xcode)
npx react-native run-ios

# Android (requires Android Studio)
npx react-native run-android
```

### Expo Setup (Alternative)

```bash
cd mobile-expo

# Install Expo CLI globally
npm install -g @expo/cli

# Start development server
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:backend
npm run test:frontend

# Run E2E tests
npm run test:e2e
```

## 🔧 Development Commands

```bash
# Start development servers
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Database operations
npm run db:migrate    # Run migrations
npm run db:seed      # Seed with sample data
npm run db:reset     # Reset database
```

## 📊 Monitoring and Logs

### Development Monitoring

```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Monitor database
docker-compose exec postgres psql -U medcare -d medcare_dev

# Monitor Redis
docker-compose exec redis redis-cli monitor
```

### Health Checks

- Backend Health: http://localhost:3001/health
- Database Status: http://localhost:3001/health/db
- Redis Status: http://localhost:3001/health/cache

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart database service
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

**2. Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different ports in .env
APP_PORT=3002
FRONTEND_PORT=3001
```

**3. Permission Errors**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**4. Docker Issues**
```bash
# Clean up Docker
docker-compose down -v
docker system prune -a

# Rebuild containers
docker-compose build --no-cache
```

### Reset Everything

```bash
# Complete reset (WARNING: Deletes all data)
docker-compose down -v
docker system prune -a
npm run clean
npm install
docker-compose up -d
```

## 🚀 Next Steps

1. **Configure External Services**
   - Set up Twilio for SMS
   - Configure AWS S3 for file storage
   - Add OpenAI API key for AI features

2. **Customize Configuration**
   - Update branding in `frontend/src/config/branding.ts`
   - Configure clinic settings
   - Set up payment gateways

3. **Deploy to Staging**
   - Follow deployment guide in `/docs/deployment/`
   - Set up CI/CD pipeline
   - Configure monitoring

4. **Read Documentation**
   - API Documentation: `/docs/api/`
   - User Guides: `/docs/user-guides/`
   - Architecture: `/docs/architecture/`

## 📞 Support

- **Documentation**: `/docs/`
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: dev@medcare.africa

## 🔐 Security Notes

- Change default passwords immediately
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regular security updates
- Follow security best practices in `/docs/security.md`

---

**Happy coding!** 🎉

For detailed setup instructions, see the specific guides in `/docs/development/`.
