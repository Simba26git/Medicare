import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MedCare Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to MedCare API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      appointments: '/api/appointments',
      prescriptions: '/api/prescriptions'
    }
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo login - in production, this would verify against database
  if (email === 'admin@medcare.africa' && password === 'Admin123!') {
    res.json({
      success: true,
      token: 'demo-jwt-token',
      user: {
        id: 1,
        email: 'admin@medcare.africa',
        name: 'Admin User',
        role: 'admin'
      }
    });
  } else if (email === 'doctor@medcare.africa' && password === 'Doctor123!') {
    res.json({
      success: true,
      token: 'demo-jwt-token',
      user: {
        id: 2,
        email: 'doctor@medcare.africa',
        name: 'Dr. Sarah Johnson',
        role: 'doctor'
      }
    });
  } else if (email === 'patient@medcare.africa' && password === 'Patient123!') {
    res.json({
      success: true,
      token: 'demo-jwt-token',
      user: {
        id: 3,
        email: 'patient@medcare.africa',
        name: 'John Doe',
        role: 'patient'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// In-memory data storage (replace with database in production)
let appointments: any[] = [
  {
    id: 1,
    patientId: 3,
    doctorId: 2,
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-28',
    time: '14:30',
    type: 'General Consultation',
    status: 'confirmed',
    notes: 'Regular checkup'
  },
  {
    id: 2,
    patientId: 4,
    doctorId: 2,
    patientName: 'Jane Smith',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-28',
    time: '15:00',
    type: 'Cardiology',
    status: 'pending',
    notes: 'Heart condition follow-up'
  },
  {
    id: 3,
    patientId: 3,
    doctorId: 2,
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-30',
    time: '10:00',
    type: 'Follow-up',
    status: 'scheduled',
    notes: 'Lab results review'
  }
];

let prescriptions: any[] = [
  {
    id: 1,
    patientId: 3,
    doctorId: 2,
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-26',
    medications: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        duration: '5 days',
        instructions: 'Take with food'
      },
      {
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'Twice daily',
        duration: '3 days',
        instructions: 'Take after meals'
      }
    ],
    status: 'active',
    diagnosis: 'Common cold with fever'
  },
  {
    id: 2,
    patientId: 4,
    doctorId: 2,
    patientName: 'Jane Smith',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-25',
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning'
      }
    ],
    status: 'active',
    diagnosis: 'Hypertension management'
  }
];

let users: any[] = [
  {
    id: 1,
    email: 'admin@medcare.africa',
    name: 'Admin User',
    role: 'admin',
    phone: '+256-700-123456',
    address: 'Kampala, Uganda'
  },
  {
    id: 2,
    email: 'doctor@medcare.africa',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
    phone: '+256-700-234567',
    specialization: 'General Medicine',
    license: 'MD12345',
    department: 'Internal Medicine'
  },
  {
    id: 3,
    email: 'patient@medcare.africa',
    name: 'John Doe',
    role: 'patient',
    phone: '+256-700-345678',
    dateOfBirth: '1990-05-15',
    bloodType: 'O+',
    allergies: ['Penicillin'],
    emergencyContact: 'Jane Doe - +256-700-456789'
  },
  {
    id: 4,
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'patient',
    phone: '+256-700-567890',
    dateOfBirth: '1985-08-22',
    bloodType: 'A+',
    allergies: [],
    emergencyContact: 'Mike Smith - +256-700-678901'
  }
];

// Notifications data
let notifications = [
  {
    id: 1,
    userId: 3,
    title: 'Appointment Reminder',
    message: 'You have an appointment tomorrow at 10:00 AM with Dr. Sarah Johnson',
    type: 'reminder',
    read: false,
    createdAt: new Date('2025-07-25T10:00:00Z').toISOString()
  },
  {
    id: 2,
    userId: 2,
    title: 'New Patient Registration',
    message: 'Jane Smith has registered as a new patient',
    type: 'info',
    read: false,
    createdAt: new Date('2025-07-25T08:30:00Z').toISOString()
  }
];

let nextId = 5;

// APPOINTMENTS API
app.get('/api/appointments', (req, res) => {
  const { role, userId } = req.query;
  
  let filteredAppointments = appointments;
  
  if (role === 'patient') {
    filteredAppointments = appointments.filter(apt => apt.patientId == userId);
  } else if (role === 'doctor') {
    filteredAppointments = appointments.filter(apt => apt.doctorId == userId);
  }
  
  res.json({
    success: true,
    appointments: filteredAppointments
  });
});

app.post('/api/appointments', (req, res) => {
  const { patientId, doctorId, date, time, type, notes } = req.body;
  
  // Find patient and doctor names
  const patient = users.find(u => u.id == patientId);
  const doctor = users.find(u => u.id == doctorId);
  
  if (!patient || !doctor) {
    return res.status(400).json({
      success: false,
      message: 'Invalid patient or doctor ID'
    });
  }
  
  const newAppointment = {
    id: nextId++,
    patientId: parseInt(patientId),
    doctorId: parseInt(doctorId),
    patientName: patient.name,
    doctorName: doctor.name,
    date,
    time,
    type,
    status: 'scheduled',
    notes: notes || ''
  };
  
  appointments.push(newAppointment);
  
  // Create notifications for both patient and doctor
  createNotification(
    newAppointment.patientId,
    'Appointment Scheduled',
    `Your appointment with ${doctor.name} has been scheduled for ${date} at ${time}`,
    'info'
  );
  
  createNotification(
    newAppointment.doctorId,
    'New Appointment',
    `New appointment scheduled with ${patient.name} on ${date} at ${time}`,
    'info'
  );
  
  res.json({
    success: true,
    appointment: newAppointment,
    message: 'Appointment scheduled successfully'
  });
});

app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appointmentIndex = appointments.findIndex(apt => apt.id == id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }
  
  appointments[appointmentIndex] = {
    ...appointments[appointmentIndex],
    ...req.body
  };
  
  res.json({
    success: true,
    appointment: appointments[appointmentIndex],
    message: 'Appointment updated successfully'
  });
});

app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appointmentIndex = appointments.findIndex(apt => apt.id == id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }
  
  appointments.splice(appointmentIndex, 1);
  
  res.json({
    success: true,
    message: 'Appointment cancelled successfully'
  });
});

// PRESCRIPTIONS API
app.get('/api/prescriptions', (req, res) => {
  const { role, userId } = req.query;
  
  let filteredPrescriptions = prescriptions;
  
  if (role === 'patient') {
    filteredPrescriptions = prescriptions.filter(presc => presc.patientId == userId);
  } else if (role === 'doctor') {
    filteredPrescriptions = prescriptions.filter(presc => presc.doctorId == userId);
  }
  
  res.json({
    success: true,
    prescriptions: filteredPrescriptions
  });
});

app.post('/api/prescriptions', (req, res) => {
  const { patientId, doctorId, medications, diagnosis } = req.body;
  
  const patient = users.find(u => u.id == patientId);
  const doctor = users.find(u => u.id == doctorId);
  
  if (!patient || !doctor) {
    return res.status(400).json({
      success: false,
      message: 'Invalid patient or doctor ID'
    });
  }
  
  const newPrescription = {
    id: nextId++,
    patientId: parseInt(patientId),
    doctorId: parseInt(doctorId),
    patientName: patient.name,
    doctorName: doctor.name,
    date: new Date().toISOString().split('T')[0],
    medications,
    diagnosis,
    status: 'active'
  };
  
  prescriptions.push(newPrescription);
  
  res.json({
    success: true,
    prescription: newPrescription,
    message: 'Prescription created successfully'
  });
});

// USERS API
app.get('/api/users', (req, res) => {
  const { role } = req.query;
  
  let filteredUsers = users;
  if (role) {
    filteredUsers = users.filter(user => user.role === role);
  }
  
  // Remove sensitive data
  const safeUsers = filteredUsers.map(user => ({
    ...user,
    password: undefined
  }));
  
  res.json({
    success: true,
    users: safeUsers
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id == id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    user: { ...user, password: undefined }
  });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id == id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    id: parseInt(id) // Ensure ID doesn't change
  };
  
  res.json({
    success: true,
    user: { ...users[userIndex], password: undefined },
    message: 'User updated successfully'
  });
});

// DASHBOARD STATS API
app.get('/api/dashboard/stats', (req, res) => {
  const { role, userId } = req.query;
  
  let stats: any = {};
  
  if (role === 'admin') {
    stats = {
      totalUsers: users.length,
      totalDoctors: users.filter(u => u.role === 'doctor').length,
      totalPatients: users.filter(u => u.role === 'patient').length,
      totalAppointments: appointments.length,
      todayAppointments: appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length,
      activePrescriptions: prescriptions.filter(p => p.status === 'active').length,
      systemHealth: 'Good'
    };
  } else if (role === 'doctor') {
    const doctorAppointments = appointments.filter(apt => apt.doctorId == userId);
    const doctorPrescriptions = prescriptions.filter(p => p.doctorId == userId);
    
    stats = {
      totalPatients: new Set(doctorAppointments.map(apt => apt.patientId)).size,
      todayAppointments: doctorAppointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length,
      totalAppointments: doctorAppointments.length,
      activePrescriptions: doctorPrescriptions.filter(p => p.status === 'active').length,
      pendingAppointments: doctorAppointments.filter(apt => apt.status === 'pending').length
    };
  } else if (role === 'patient') {
    const patientAppointments = appointments.filter(apt => apt.patientId == userId);
    const patientPrescriptions = prescriptions.filter(p => p.patientId == userId);
    
    stats = {
      upcomingAppointments: patientAppointments.filter(apt => new Date(apt.date) >= new Date()).length,
      pastAppointments: patientAppointments.filter(apt => new Date(apt.date) < new Date()).length,
      activePrescriptions: patientPrescriptions.filter(p => p.status === 'active').length,
      totalPrescriptions: patientPrescriptions.length
    };
  }
  
  res.json({
    success: true,
    stats
  });
});

// NOTIFICATIONS API
app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  
  let userNotifications = notifications.filter(notif => notif.userId == Number(userId));
  
  // Sort by creation date (newest first)
  userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  res.json({
    success: true,
    notifications: userNotifications
  });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  
  const notification = notifications.find(notif => notif.id == Number(id));
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }
  
  notification.read = true;
  
  res.json({
    success: true,
    message: 'Notification marked as read'
  });
});

app.delete('/api/notifications/:id', (req, res) => {
  const { id } = req.params;
  
  const notificationIndex = notifications.findIndex(notif => notif.id == Number(id));
  
  if (notificationIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }
  
  notifications.splice(notificationIndex, 1);
  
  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

// Helper function to create notifications
function createNotification(userId: number, title: string, message: string, type: string = 'info') {
  const newNotification = {
    id: notifications.length + 1,
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.push(newNotification);
  return newNotification;
}

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MedCare Backend API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API docs: http://localhost:${PORT}/api`);
});

export default app;
