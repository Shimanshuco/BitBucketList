# 📌 BitBucketList – Simplified GitHub Clone

BitBucketList is a **full-stack project** that provides repository hosting, issue tracking, and user management — similar to GitHub, but simplified for learning purposes.  

- ⚛️ **Frontend:** React (Vite) + Tailwind CSS  
- 🟢 **Backend:** Node.js + Express + MongoDB  
- 🔗 Communication: REST API (backend exposed at `http://localhost:8000`)  

---

## 🚀 Features

- 🔑 **Authentication** – Signup, Login, Logout with JWT  
- 👤 **User Profiles** – View, edit, delete own profile  
- 📦 **Repositories** – Create, list, view details, update, delete  
- 🐛 **Issues** – Create, view, edit, delete issues per repository
- ☁️ **AWS S3 Integration** – Upload files to repositories  
- 🔒 **Protected Routes** – Only logged-in users can modify data  
- 👀 **Public Access** – Other users can only view repositories/issues  
- 💾 **Persistent Login** – Token stored in `localStorage`  

---

## 📂 Project Structure

```

BitBucketList/
├── backend/              # Express.js + MongoDB server
│   ├── models/           # Mongoose models (User, Repo, Issue)
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── index.js          # Entry point
│   └── package.json
|   └── .env              # 
│
├── frontend/             # React + Vite client
│   ├── src/
│   │   ├── api/          # Axios API calls
│   │   ├── components/   # UI components (Navbar, PrivateRoute)
│   │   ├── context/      # AuthContext
│   │   ├── pages/        # Page components
│   │   ├── App.jsx       # Routes
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── README.md             # Project documentation
└── package.json          # Root (optional if using workspaces)

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone <your-repo-url>
cd BitBucketList
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```
👉 Create a .env file in backend/ with the following:

```bash
# Server
PORT=8000
MONGO_URI=mongodb://localhost:27017/bitbucketlist
JWT_SECRET=your_jwt_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket_name
```

Then start the backend:
```bash
npm start
```

* Runs on 👉 `http://localhost:8000`
* Requires **MongoDB** running locally or via Atlas

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

* Runs on 👉 `http://localhost:5173`

⚠️ Ensure **backend is running** before using the frontend.

---

## 🔒 Authentication Behavior

* Users must **log in** to create, update, or delete repositories/issues.
* Other users can only **view repositories/issues (read-only)**.
* Auth state is stored in `localStorage`.
* Protected routes use **PrivateRoute** (frontend).

---

## 🎨 Styling

* Tailwind CSS is used for styling.
* Customize in `frontend/src/index.css`.
* Extend Tailwind config for global themes.

---

## ✅ Future Improvements

* ⭐ Add stars/forks system for repositories
* 💬 Add comments on issues
* 🔔 Notifications system
* 👥 Team & project collaboration features
* 🌙 Dark mode

---

## 📝 License

MIT License © 2025

---

