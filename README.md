<<<<<<< HEAD
# 🚀 LinkedIn Clone - Full Stack Social Media Application

A modern, feature-rich social media platform inspired by LinkedIn, built with the MERN stack (MongoDB, Express, React, Node.js).

![LinkedIn Clone](https://img.shields.io/badge/Stack-MERN-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### Core Features
- ✅ **User Authentication**
  - Secure signup and login with JWT tokens
  - Password hashing with bcrypt
  - Protected routes and middleware

- ✅ **Post Management**
  - Create, read, update, and delete posts
  - Real-time feed with latest posts
  - Character limit validation

- ✅ **Social Interactions**
  - Like/Unlike posts
  - Comment on posts
  - View engagement statistics

- ✅ **User Experience**
  - Responsive design for all devices
  - Modern LinkedIn-inspired UI
  - Smooth animations and transitions
  - Loading states and error handling

### Bonus Features Implemented
- ✅ Like and comment functionality
- ✅ Edit and delete own posts
- ✅ User profile display in navbar
- ✅ Real-time relative timestamps

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Modern icon library
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing

## 📁 Project Structure

```
linkedin-clone/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Post.js               # Post schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   └── posts.js              # Post management routes
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── CreatePost.jsx    # Post creation form
│   │   │   ├── PostCard.jsx      # Individual post component
│   │   │   └── Feed.jsx          # Posts feed
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Signup.jsx        # Registration page
│   │   │   └── Home.jsx          # Home/Feed page
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Global styles
│   │   └── index.js              # React entry point
│   └── package.json
│
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/linkedin-clone.git
cd linkedin-clone
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

#### Getting MongoDB URI:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

### Frontend Configuration

The frontend is configured to proxy API requests to `http://localhost:5000` in development (see `frontend/package.json`).

For production, update the axios base URL in your components or use environment variables.

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
The frontend will open automatically at `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 🌐 Deployment

### Backend Deployment (Render/Railway)

#### Using Render:
1. Push your code to GitHub
2. Go to [Render Dashboard](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=your_frontend_url`

#### Using Railway:
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add variables: `railway variables set MONGODB_URI=your_uri`
5. Deploy: `railway up`

### Frontend Deployment (Vercel/Netlify)

#### Using Vercel:
```bash
cd frontend
npm install -g vercel
vercel
```

#### Using Netlify:
1. Build the project: `npm run build`
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Deploy: `netlify deploy --prod`

Or use the Netlify web interface:
1. Drag and drop the `build` folder
2. Configure build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`

**Important:** Update the backend URL in your frontend code after deployment!

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |

### Post Routes (`/api/posts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all posts | Yes |
| POST | `/` | Create new post | Yes |
| PUT | `/:id` | Update post | Yes |
| DELETE | `/:id` | Delete post | Yes |
| POST | `/:id/like` | Like/Unlike post | Yes |
| POST | `/:id/comment` | Add comment | Yes |

## 📸 Screenshots

### Login Page
Clean and modern authentication interface with form validation.

### Home Feed
Real-time feed displaying all posts with engagement options.

### Create Post
Intuitive post creation with character count and validation.

### Post Interactions
Like, comment, edit, and delete functionality for enhanced user engagement.

## 🎨 Design Highlights

- **Modern LinkedIn-inspired UI** with professional color scheme
- **Fully responsive** design that works on desktop, tablet, and mobile
- **Smooth animations** and transitions for better UX
- **Accessible** forms with proper labeling and focus states
- **Loading states** and error handling throughout the app

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected API routes with middleware
- Input validation and sanitization
- CORS configuration for production
- HTTP-only secure practices

## 🐛 Known Issues & Future Enhancements

### Planned Features:
- [ ] Image upload for posts and profile pictures
- [ ] User profile pages
- [ ] Connection/Follow system
- [ ] Private messaging
- [ ] Notifications
- [ ] Search functionality
- [ ] Post sharing
- [ ] Hashtags and mentions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Inspired by LinkedIn's design and functionality
- Built as part of AppDost Full Stack Developer Internship Assignment
- Icons from [Lucide React](https://lucide.dev/)

---

### 📧 Contact

For any questions or feedback, please reach out to **hr@appdost.in**

**Assignment Submission:**
- GitHub Repository: [your-repo-link]
- Live Demo: [your-deployed-link]
- Completed: [Date]

---

⭐ If you found this project helpful, please consider giving it a star!
=======
# linked-in-clone
web based project
>>>>>>> aae1d43692b60b6cb5fc57220916386cb5dba316
Here is the screen shorts of the project
sign.in page
<img width="1918" height="1020" alt="image" src="https://github.com/user-attachments/assets/dbcd002f-c177-4afe-942c-7727aeaa9850" />
sing.up page
<img width="1911" height="1017" alt="image" src="https://github.com/user-attachments/assets/0222702e-7c6f-4e47-98ac-d5a35f2bce92" />
Main page
<img width="1915" height="1017" alt="image" src="https://github.com/user-attachments/assets/7d4e6eae-2651-4c0c-86ca-ec7eea858c49" />
profile page
<img width="1919" height="1016" alt="image" src="https://github.com/user-attachments/assets/5b0c0556-becf-42e0-b75c-3be78daaaf36" />





