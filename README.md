# Mentorship Platform Admin Dashboard

This project is an admin interface for a mentorship platform built with **React**, **Node.js**, and **MongoDB**. It includes features for user management, mentor-mentee matching, session scheduling, and feedback collection.

---

## 🔧 Features

- 🔐 Admin role management
- 👥 Assign mentors to mentees manually
- 📅 Schedule mentorship sessions
- 📈 Dashboard with session statistics (using Recharts)
- ✅ View completed and pending sessions
- 💬 Feedback collection and rating system

---

## 📊 Tech Stack

- **Frontend**: React, TailwindCSS, Recharts
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT-based
- **Data Visualization**: Recharts

---

## 🚀 Getting Started

### Clone the repository

```bash
git https://github.com/Legit-Sam/Capstone-Project.git
cd Capstone-Project
```

Install dependencies

```bash

# Backend
cd server
npm install

# Frontend
cd ../client
npm install

```


Set up environment variables
Create a .env file in the server directory:


MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret


```bash
💻 Run Locally
# Start backend
cd server
npm run dev

# Start frontend
cd client
npm run dev

```



📂 Project Structure

```bash
/client         → React frontend (admin dashboard)
/server         → Express backend and API routes
  ├── models
  ├── routes
  ├── controllers
  ├── middleware
```

  📸 Screenshots
  


✍️ License
MIT



👨‍💻 Author
Clinton Emmanuel — @samwebdata.com.ng