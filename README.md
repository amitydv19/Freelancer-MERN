_**Freelancer MERN App**_

          A full-stack freelance marketplace application built using the MERN stack.
          It allows users to post jobs, bid on projects, and connect with freelancers in a simple and practical way.

_**About the Project**_

          This project is designed to simulate a real-world freelance platform where two types of users interact:
  
          Clients can post jobs and hire freelancers
          Freelancers can explore jobs and place bids

The goal of this project was to understand full-stack development, API design, authentication, and how frontend and backend systems work together.

_**Features**_

        User registration and login
        Role-based access (Client / Freelancer)
        Create and manage job posts
        Bid on available jobs
        View user profiles
        Basic dashboard functionality
        Secure authentication using JWT
        Tech Stack

**_Frontend_**

        React.js
        CSS / Tailwind / Bootstrap (based on your setup)

**_Backend_**

        Node.js
        Express.js

**_Database_**

        MongoDB with Mongoose
  
**_Folder Structure_**

      Freelancer-MERN/
      │
      ├── client/        # Frontend (React)
      ├── server/        # Backend (Node + Express)
      ├── .env           # Environment variables
      └── README.md
  
_**Getting Started**_

      Clone the repository
      git clone https://github.com/amitydv19/Freelancer-MERN.git
      cd Freelancer-MERN
      Install dependencies

**_Backend_**

      cd server
      npm install

**_Frontend_**

      cd ../client
      npm install
  
**Environment Variables**

  Create a .env file in the server folder and add:
  
  PORT=5000
  MONGO_URI=*************
  JWT_SECRET=************

**_Start backend_**

      cd server
      npm run dev

**_Start frontend_**

      cd client
      npm start
      
