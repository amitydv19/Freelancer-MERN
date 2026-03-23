import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'

import Landing from './pages/Landing'
import Authenticate from './pages/Authenticate'

import Freelancer from './pages/freelancer/Freelancer'
import AllProjects from './pages/freelancer/AllProjects'
import MyProjects from './pages/freelancer/MyProjects'
import MyApplications from './pages/freelancer/MyApplications'
import ProjectData from './pages/freelancer/ProjectData'

import Client from './pages/client/Client'
import ProjectApplications from './pages/client/ProjectApplications'
import NewProject from './pages/client/NewProject'
import ProjectWorking from './pages/client/ProjectWorking'

import Admin from './pages/admin/Admin'
import AdminProjects from './pages/admin/AdminProjects'
import AllApplications from './pages/admin/AllApplications'
import AllUsers from './pages/admin/AllUsers'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages that have their OWN navbar built in — hide the global one
const NO_NAVBAR_ROUTES = [
  '/authenticate',
  '/freelancer',   // covers /freelancer, /freelancer/all-projects, etc.
  '/client',
  '/new-project',
  '/project-applications',
  '/admin',
  '/admin-projects',
  '/admin-applications',
  '/all-users',
]

function App() {
  const { pathname } = useLocation()

  // Hide global navbar if current path starts with any of the above
  const hideNavbar = NO_NAVBAR_ROUTES.some(route => pathname.startsWith(route))

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* Only show global Navbar on Landing page */}
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/authenticate" element={<Authenticate />} />

        <Route path="/freelancer" element={<Freelancer />} />
        <Route path="/freelancer/all-projects" element={<AllProjects />} />
        <Route path="/freelancer/my-projects" element={<MyProjects />} />
        <Route path="/freelancer/myApplications" element={<MyApplications />} />
        <Route path="/freelancer/project/:id" element={<ProjectData />} />

        <Route path="/client" element={<Client />} />
        <Route path="/project-applications" element={<ProjectApplications />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/client-project/:id" element={<ProjectWorking />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-projects" element={<AdminProjects />} />
        <Route path="/admin-applications" element={<AllApplications />} />
        <Route path="/all-users" element={<AllUsers />} />
      </Routes>
    </div>
  )
}

export default App