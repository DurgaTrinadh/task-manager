Task Management Application

A full-stack Task Management Application that helps users create, organize, update, and track tasks efficiently. The application provides secure authentication, task management features, and a responsive user experience across desktop and mobile devices.

🌐 Live Demo:
[Task Management Application](https://task-manager-weld-kappa.vercel.app/)

📌 Project Overview

This project was developed to learn and implement full-stack web development concepts including authentication, REST APIs, database integration, deployment, and responsive UI design.

The application allows users to:

Register and log in securely
Create, update, and delete tasks
Track task progress
Organize tasks efficiently
Access the application from both desktop and mobile devices
🚀 Features
🔐 User Authentication & Authorization
User Registration
User Login
Secure Password Hashing
JWT-based Authentication
Protected Routes
User-specific Task Access
📋 Task Management (CRUD)
Create new tasks
View all tasks
Update task details
Delete tasks
Track task status
📊 Task Tracking
Task title and description
Priority management
Status updates
Organized task workflow
📱 Responsive Design
Mobile-friendly UI
Tablet compatibility
Desktop optimization
Modern user experience
⚡ Full-Stack Integration
Frontend connected with backend APIs
Dynamic data fetching
Real-time UI updates after CRUD operations
🛠️ Tech Stack
Frontend
React.js
JavaScript (ES6+)
HTML5
CSS3
Axios
React Router
Backend
Node.js
Express.js
Database
MongoDB
Mongoose
Authentication
JWT (JSON Web Token)
bcrypt.js
Deployment
Frontend: Vercel
Backend: Railway
📂 Project Structure
task-manager/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
⚙️ Installation
Clone Repository
git clone <repository-url>
cd task-manager
Frontend Setup
cd frontend
npm install
npm start
Backend Setup
cd backend
npm install
npm run dev
Environment Variables

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
🎯 Learning Outcomes

This project helped in understanding:

Full-stack application architecture
REST API development
MongoDB database operations
User authentication and authorization
Frontend-backend communication
State management
Deployment using Vercel and Railway
Responsive web design
CRUD operations in real-world applications
📸 Application Highlights
Secure Login & Registration
Task Creation and Management
Dynamic Data Handling
Mobile Responsive Design
Cloud Deployment
Clean User Interface
Future Enhancements
Real-time updates using WebSockets
Task categories
Due dates and reminders
Drag-and-drop Kanban board
Team collaboration
Email notifications
Dark/Light theme toggle
👨‍💻 Author

Durga Trinadh Ranganadham

3rd Year Computer Science Engineering Student

Passionate about:

Full Stack Development
MERN Stack
Web Applications
Software Engineering
📄 License

This project is developed for educational and learning purposes.
