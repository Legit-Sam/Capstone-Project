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
/client         → React frontend (admin dashboard)
/server         → Express backend and API routes
  ├── models
  ├── routes
  ├── controllers
  ├── middleware
```

---

## 📸 Screenshots

<!-- Add screenshots here -->

---

## ✍️ License

MIT

---

## 👨‍💻 Author

Clinton Emmanuel — [@samwebdata.com.ng](mailto:samwebdata.com.ng)