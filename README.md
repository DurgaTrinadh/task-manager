# ✅ TaskFlow — Real-Time Task Manager

A full-stack task management application with real-time updates, JWT authentication, and a clean React UI.

🔗 **Live Site:** [task-manager-weld-kappa.vercel.app](https://task-manager-weld-kappa.vercel.app/)  
📦 **Repo:** [github.com/DurgaTrinadh/task-manager](https://github.com/DurgaTrinadh/task-manager)

---

## ✨ Features

- **JWT Authentication** — Secure register & login with token-based sessions
- **Real-Time Updates** — Live task changes using Socket.io (no page refresh needed)
- **Create / Edit / Delete Tasks** — Full CRUD for task management
- **Task Status Tracking** — Mark tasks as pending, in-progress, or completed
- **Persistent Storage** — All tasks saved to MongoDB
- **Responsive UI** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer      | Technologies                          |
|------------|---------------------------------------|
| Frontend   | React, Socket.io-client               |
| Backend    | Node.js, Express, Socket.io           |
| Database   | MongoDB, Mongoose                     |
| Auth       | JWT (JSON Web Tokens)                 |
| Hosting    | Vercel (frontend), Railway (backend)  |

---

## 📁 Project Structure

```
task-manager/
├── frontend/               # React app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Login, Register, Dashboard
│   │   └── App.js
│   └── package.json
├── backend/                # Node.js/Express API
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # JWT auth middleware
│   ├── controllers/        # Business logic
│   └── index.js
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/DurgaTrinadh/task-manager.git
cd task-manager
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

```bash
node index.js
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
REACT_APP_API_URL=http://localhost:5000
```

```bash
npm start
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.

---

## 🌍 Deployment

- **Frontend** deployed on [Vercel](https://vercel.com/)
- **Backend** deployed on [Railway](https://railway.app/) (fallback: [Render](https://render.com/))
- **Database** hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)

Set all environment variables in your Vercel and Railway dashboards before deploying. Make sure `CLIENT_URL` in the backend matches your Vercel frontend URL to avoid CORS issues.

---

## 🔌 API Endpoints

| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| POST   | `/api/auth/register`  | Register a new user      | ❌            |
| POST   | `/api/auth/login`     | Login and get JWT token  | ❌            |
| GET    | `/api/tasks`          | Get all tasks for user   | ✅            |
| POST   | `/api/tasks`          | Create a new task        | ✅            |
| PUT    | `/api/tasks/:id`      | Update a task            | ✅            |
| DELETE | `/api/tasks/:id`      | Delete a task            | ✅            |

---

## 📬 Contact

| Platform | Link |
|----------|------|
| Email    | durgatrinadhranganadham@gmail.com |
| GitHub   | [github.com/DurgaTrinadh](https://github.com/DurgaTrinadh) |
| LinkedIn | [linkedin.com/in/durga-trinadh-ranganadham](https://www.linkedin.com/in/durga-trinadh-ranganadham-82b37a32b/) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with ❤️ by Ranganadham Durga Trinadh
