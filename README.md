# Mentorship Platform Admin Dashboard

An admin interface for a mentorship platform built with **React**, **Node.js**, and **MongoDB**. Features include user management, mentor-mentee matching, session scheduling, and feedback collection.

---

## 🔧 Features

- 🔐 Admin role management
- 👥 Manual mentor-mentee assignment
- 📅 Mentorship session scheduling
- 📈 Dashboard with session statistics (Recharts)
- ✅ View completed & pending sessions
- 💬 Feedback collection and rating system

---

## 📊 Tech Stack

- **Frontend:** React, TailwindCSS, Recharts
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT-based
- **Data Visualization:** Recharts

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Legit-Sam/Capstone-Project.git
cd Capstone-Project
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `server` directory:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### 4. Run Locally

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
```

---

## 📂 Project Structure

```bash
📦 mentorship-platform/
├── client/                           # React frontend (Vite-based)
│   ├── public/                       # Static assets (favicon, robots.txt)
│   ├── src/
│   │   ├── assets/                   # Images, icons, etc.
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # React Context (e.g. AuthContext)
│   │   ├── layouts/                 # Shared layout components (e.g., DashboardLayout)
│   │   ├── pages/                   # Route-based pages
│   │   │   ├── admin/
│   │   │   ├── mentor/
│   │   │   ├── mentee/
│   │   ├── services/                # Axios API calls (e.g., mentorServices.js)
│   │   ├── lib/                   # Helper functions or constants
│   │   ├── App.jsx                  # Route logic
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── .env                         # Frontend environment config (VITE_*)
│   ├── vite.config.js               # Vite config
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/                      # DB config, environment setup
│   │   └── database.js
│   ├── controllers/                # Route logic handlers
│   ├── middleware/                 # Auth, error handling, etc.
│   ├── models/                     # Mongoose models (User, Availability, Session, Request)
│   ├── routes/                     # Express routers
│   ├── utils/                      # Helper utilities (e.g. token, validators)
│   ├── .env                        # Backend environment config
│   ├── server.js                   # Entry point
│   └── package.json
│
├── README.md
└── .gitignore

```

---

## 📸 Video URL
```bash
https://drive.google.com/file/d/1Mzfkf9wg9848vm6poyXJU-so3D8UUlrt/view?usp=sharing

```
---

## ✍️ License

MIT

---

## 👨‍💻 Author

Clinton Emmanuel — [@samwebdata.com.ng](mailto:samwebdata.com.ng)