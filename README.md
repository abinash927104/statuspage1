# 🌐 Status Page Application

A simplified status page system inspired by solutions like StatusPage, Cachet, BetterStack, and OpenStatus. This application lets administrators manage services and their statuses, while providing a public-facing page where users can view the current status of all services in real time.

**Live Demo:** 
https://statuspagenew-git-main-abinash927104s-projects.vercel.app/

## 📦 Tech Stack

### Frontend
- **Framework:** Next.js (with the new App directory structure)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Icons:** Lucide React

### Backend
- **Framework:** Express.js
- **Language:** JavaScript
- **Database:** MongoDB Atlas
- **Authentication:** JWT + bcrypt
- **ODM:** Mongoose

---

## 🗂️ Project Structure

### Frontend (Next.js)
The frontend project uses the new Next.js app directory structure:
frontend/ ├── app/ # Application pages and layouts │ └── ... # (Your Next.js components & routes) ├── public/ # Static assets (images, favicon, etc.) ├── .gitignore # Specifies intentionally untracked files to ignore ├── README.md # Frontend-specific documentation (this file is for overall setup instructions) ├── eslint.config.mjs # ESLint configuration ├── next-env.d.ts # Next.js TypeScript environment definitions ├── next.config.ts # Next.js configuration ├── package-lock.json # Lock file for npm dependencies ├── package.json # Frontend dependencies and scripts ├── postcss.config.mjs # PostCSS configuration for TailwindCSS └── tsconfig.json # TypeScript configuration

shell
Copy
Edit

### Backend (Express.js)
The backend project follows a typical Node.js project structure:
backend/ ├── controllers/ # API logic for various routes ├── models/ # Mongoose models (User, Service, Organization, etc.) ├── routes/ # Express route definitions ├── server.js # Main application entry point └── .env # Environment variables (not committed)

yaml
Copy
Edit

---

## ⚙️ Environment Setup

### 1. Backend Setup

#### Environment Variables
Create a file named `.env` in the **backend/** directory with the following contents:

```env
PORT=5000
MONGO_URI_ATLAS=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
Replace your_mongodb_atlas_connection_string with your actual MongoDB Atlas URI and your_jwt_secret with a secure string.

Install Dependencies & Run
Open your terminal, navigate to the backend/ folder, and run:

bash
Copy
Edit
cd backend
npm install
npm run dev
This starts the Express.js API server in development mode using Nodemon.

2. Frontend Setup
Environment Variables
Create a file named .env.local in the frontend/ directory with the following contents:

env
Copy
Edit
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
This variable tells the Next.js frontend where to find your backend API. Adjust it if your backend runs on a different host or port.

Install Dependencies & Run
Open your terminal, navigate to the frontend/ folder, and run:

bash
Copy
Edit
cd frontend
npm install
npm run dev
This command starts the Next.js development server. By default, the app will be available at http://localhost:3000.

🚀 Running the Application Locally
Start the Backend Server:

Navigate to the backend/ folder.

Run npm run dev to start the Express.js API server.

Start the Frontend Application:

Navigate to the frontend/ folder.

Run npm run dev to start the Next.js application.

View the Application:

Open your browser and visit http://localhost:3000.

✨ Features
User Authentication: Secure JWT-based login and registration; passwords are hashed using bcrypt.

Team & Organization Management: Manage teams and assign users to multi-tenant organizations.

Service Management:

Create, read, update, and delete (CRUD) operations for services (e.g., Website, API, Database).

Update service statuses (e.g., "Operational", "Degraded Performance", "Partial Outage", "Major Outage").

Public Status Page: Displays service statuses in real-time for end-users.

