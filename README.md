**Freelancer MERN App**

  A full-stack freelance marketplace application built using the MERN stack.
  It allows users to post jobs, bid on projects, and connect with freelancers in a simple and practical way.

**About the Project**

  This project is designed to simulate a real-world freelance platform where two types of users interact:
  
  Clients can post jobs and hire freelancers
  Freelancers can explore jobs and place bids

The goal of this project was to understand full-stack development, API design, authentication, and how frontend and backend systems work together.

**Features**
  User registration and login
  Role-based access (Client / Freelancer)
  Create and manage job posts
  Bid on available jobs
  View user profiles
  Basic dashboard functionality
  Secure authentication using JWT
  Tech Stack

**Frontend**

  React.js
  CSS / Tailwind / Bootstrap (based on your setup)

**Backend**

  Node.js
  Express.js

**Database**

  MongoDB with Mongoose
  
**Folder Structure**
  Freelancer-MERN/
  │
  ├── client/        # Frontend (React)
  ├── server/        # Backend (Node + Express)
  ├── .env           # Environment variables
  └── README.md
  
**Getting Started**

  Clone the repository
  git clone https://github.com/amitydv19/Freelancer-MERN.git
  cd Freelancer-MERN
  Install dependencies

**Backend**

  cd server
  npm install

**Frontend**

  cd ../client
  npm install
  
**Environment Variables**

  Create a .env file in the server folder and add:
  
  PORT=5000
  MONGO_URI=*************
  JWT_SECRET=************

**Start backend**

  cd server
  npm run dev

**Start frontend**

  cd client
  npm start
  
