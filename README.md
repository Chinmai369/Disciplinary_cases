# Disciplinary Cases Management System

A full-stack application for managing employee disciplinary cases built with React.js, Node.js, and Tailwind CSS.

## Features

- ✅ User authentication with login system
- ✅ Create, read, update, and delete disciplinary cases
- ✅ Dashboard with statistics and recent cases
- ✅ Filter and search functionality
- ✅ Responsive design for all screen sizes
- ✅ MVC architecture on the backend
- ✅ Local storage (file-based) for data persistence
- ✅ Database schema ready for future database integration
- ✅ Protected routes and session management

## Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MVC Architecture
- File-based storage (JSON files)

## Project Structure

```
Disciplinary_Cases/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── database/        # Database schemas
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.js       # Main app component
│   └── public/
└── package.json
```

## Installation

1. Install root dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

## Running the Application

### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

##Default Login Credentials

The application creates default users on first startup:

- **Admin User:**
  - Username: `admin`
  - Password: `admin123`

- **Regular User:**
  - Username: `user`
  - Password: `user123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - Verify authentication token

### Disciplinary Cases
- `GET /api/disciplinary` - Get all cases
- `GET /api/disciplinary/:id` - Get case by ID
- `POST /api/disciplinary` - Create new case
- `PUT /api/disciplinary/:id` - Update case
- `DELETE /api/disciplinary/:id` - Delete case
- `GET /api/disciplinary/employee/:employeeId` - Get cases by employee ID

## Database Schema

The database schema is defined in `backend/database/schema.sql`. When you're ready to connect to a database, you can use this schema to create the tables.

## Future Enhancements

- [ ] Connect to MySQL/PostgreSQL database
- [ ] Add JWT token authentication (currently using simple token system)
- [ ] Add password hashing with bcrypt
- [ ] Add file attachments
- [ ] Add email notifications
- [ ] Add reporting and analytics
- [ ] Add case history tracking
- [ ] Add role-based access control

## License

ISC

