# OMOTEC School Curriculum Management System

A complete full-stack curriculum management application for schools with role-based access control.

## Project Structure

```
omotec-project/
├── public/
│   ├── login.html              # Login page
│   ├── dashboard.html          # Curriculum dashboard
│
├── server/
│   ├── server.js               # Main Express server
│   ├── db.js                   # Database configuration
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── curriculum.js       # Curriculum CRUD routes
│
├── database/
│   └── schema.sql              # MySQL database schema
│
├── scripts/
│   └── import-excel.js         # Excel data import script
│
├── package.json                # Dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Features

### User Roles & Permissions

#### Manager
- ✅ View all curriculum
- ✅ Add new curriculum
- ✅ Edit existing curriculum
- ✅ Delete curriculum

**Login Credentials:**
- Email: `Manager@123`
- Password: `password@4321`

#### Employee
- ✅ View curriculum only
- ❌ Cannot add, edit, or delete

**Login Credentials:**
- Email: `Employee@123`
- Password: `password@1234`

### Key Features
- Secure login with password hashing (bcrypt)
- Role-based access control
- CRUD operations for curriculum
- Search and filter functionality
- Responsive design
- Session management
- Data persistence in MySQL

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone/Download Project

```bash
cd omotec-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

#### Option A: Using MySQL Command Line

```bash
mysql -u root -p < database/schema.sql
```

#### Option B: Using MySQL Workbench or phpMyAdmin

Copy and run the contents of `database/schema.sql` in your MySQL client.

### 4. Configure Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and update your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=omotec_curriculum
PORT=3000
NODE_ENV=development
SESSION_SECRET=omotec_secret_key_2024
```

### 5. Hash Default Passwords (Optional but Recommended)

The default passwords in the database should be hashed. Use bcrypt:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password@4321', 10, (err, hash) => { console.log(hash); });"
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password@1234', 10, (err, hash) => { console.log(hash); });"
```

Update these hashed values in the database's `users` table.

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production Mode

```bash
npm start
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password

```json
{
    "email": "Manager@123",
    "password": "password@4321"
}
```

Response:
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": 1,
        "email": "Manager@123",
        "role": "manager"
    }
}
```

#### POST /api/auth/logout
Logout and destroy session

#### GET /api/auth/session
Get current session information

### Curriculum Endpoints

#### GET /api/curriculum
Get all curriculum (requires authentication)

#### GET /api/curriculum/:id
Get single curriculum by ID

#### POST /api/curriculum
Create new curriculum (manager only)

```json
{
    "class_name": "10th Grade",
    "subject": "Mathematics",
    "topic": "Algebra",
    "description": "Study of algebraic expressions"
}
```

#### PUT /api/curriculum/:id
Update curriculum (manager only)

```json
{
    "class_name": "10th Grade",
    "subject": "Mathematics",
    "topic": "Geometry",
    "description": "Study of geometric shapes"
}
```

#### DELETE /api/curriculum/:id
Delete curriculum (manager only)

## Importing Excel Data

### Step 1: Download Excel File

Download the curriculum data Excel file from:
https://1drv.ms/x/c/fd7f1ff804d6c5bb/IQAUpykxRhraQL82JhOIHe93AZTWLX8CknKNgdSyuJ9LjC4?e=SVAxLI

### Step 2: Prepare Excel File

1. Save the file as `curriculum_data.xlsx`
2. Place it in the `scripts/` folder

### Step 3: Run Import Script

```bash
node scripts/import-excel.js
```

The script will:
- Read the Excel file
- Validate data structure
- Insert data into MySQL
- Display summary of imported records

### Excel File Format

The Excel file must have these columns:
- `class_name` (required)
- `subject` (required)
- `topic` (required)
- `description` (optional)

## Security Considerations

1. **Password Hashing**: Passwords are hashed using bcrypt
2. **Session Management**: HTTP-only cookies with secure flag in production
3. **CORS**: Configured to accept requests only from specified origins
4. **Role-Based Access**: Server-side validation of user roles
5. **SQL Injection Prevention**: Using parameterized queries

## Troubleshooting

### Database Connection Error

```
Error: PROTOCOL_CONNECTION_LOST
```

**Solution:**
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `omotec_curriculum` exists

### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solution:**
- Kill process on port 3000
- Or change PORT in `.env`

### Login Failed

**Solution:**
- Verify user exists in database
- Check password is correctly hashed
- Verify database is connected

## Development Notes

### Adding New Features

1. **New API Endpoint**: Add to `server/routes/`
2. **Database Change**: Update `database/schema.sql`
3. **Frontend Change**: Update HTML files in `public/`

### Code Style

- Use ES6+ syntax
- Clear variable naming
- Comment all major sections
- Handle errors gracefully

## License

MIT License - Open source for educational purposes

## Support

For issues or questions, please create an issue in the project repository.

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Developed by:** OMOTEC Development Team
