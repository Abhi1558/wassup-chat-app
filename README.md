# Wassup

Wassup is a modern full-stack real-time chat application built with the MERN stack. It provides a secure and responsive messaging experience with authentication, email verification, profile management, image uploads, and real-time communication powered by Socket.IO.

---

## Features

* Real-time one-to-one messaging
* Secure JWT Authentication
* Email Verification
* Forgot Password and Reset Password
* Online and Offline User Status
* Message Seen Status
* User Profile Management
* Profile Image Uploads
* Protected Routes
* Responsive User Interface
* Secure API with Helmet and Rate Limiting

---

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Tailwind CSS
* DaisyUI
* Zustand
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT
* bcrypt
* Cookie Parser
* Helmet
* Express Rate Limiter
* Multer
* Cloudinary
* Brevo Email API

### DevOps

* Docker
* Docker Compose

---

## Project Structure

```text
wassup-chat-app/
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   └── package.json
├── backend/
│   ├── Dockerfile
│   ├── src/
│   └── package.json
├── docker-compose.yml
├── README.md
└── .env.example
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Abhi1558/wassup-chat-app.git
cd wassup-chat-app
```

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend directory or copy the `.env.example` file and replace the placeholder values.

```env
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

BREVO_API_KEY=your_brevo_api_key
BREVO_USER=your_brevo_email

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

---

## Run Locally

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## Run with Docker

Build and start all services:

```bash
docker compose up --build
```

Run containers in detached mode:

```bash
docker compose up -d
```

Stop all containers:

```bash
docker compose down
```

View container logs:

```bash
docker compose logs -f
```

Rebuild containers after changes:

```bash
docker compose up --build
```

---

## Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Secure Cookies
* Helmet Security Headers
* API Rate Limiting
* Environment Variable Configuration

---

## Future Enhancements

* Group Chat
* Voice and Video Calling
* File Sharing
* Picture Sharing
* Message Reactions
* Toast Notifications
* Last Seen and Last Active
* Last Message Preview
* Block and Unblock Users

---

## Screenshots

Add screenshots or GIFs of:

* Login
* Email Verification
* Real-Time Chat
* Online Users
* Seen Status
* Profile Update

---

## Learning Outcomes

This project helped me strengthen my understanding of:

* Full-Stack MERN Development
* Real-Time Communication with Socket.IO
* Authentication and Authorization using JWT
* REST API Design
* MongoDB Data Modeling
* State Management with Zustand
* Secure File Uploads using Multer and Cloudinary
* API Security using Helmet and Rate Limiting
* Containerization with Docker and Docker Compose
* Production Deployment and Debugging

---

## Author

**Abhijeet Yadav**

GitHub: https://github.com/Abhi1558

LinkedIn: https://www.linkedin.com/in/abhijeet-yadav-dev/
