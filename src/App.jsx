import { useState } from 'react'
import './App.css'
import Header from './Header'
import Sidebar from './Sidebar'
import Home from './Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TBT from './Screens/TBT'
import NearMiss from './Screens/NearMiss'
import LineWalk from './Screens/LineWalk'
import Setting from './Screens/Setting'
import Master from './Screens/Master'
import User from './Screens/User'

import DepartmentPage from './Screens/Master/Department'
import BranchPage from './Screens/Master/Branch'
import DesignationPage from './Screens/Master/Designation'
import Roles from './Screens/Master/Role'

import LoginPage from './Screens/LoginPage'
import ProtectedRoute from './Components/ProtectedRoute'
import ItemOfInterestPage from './Screens/Master/ItemOfIntrest'
import SectionPage from './Screens/Master/Section'
function App() {

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <Router>

      <Routes>

        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className='grid-container'>
                <Header OpenSidebar={OpenSidebar} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="users" element={<User />} />
                  <Route path="tbt" element={<TBT />} />
                  <Route path="nearmiss" element={<NearMiss />} />
                  <Route path="linewalk" element={<LineWalk />} />
                  <Route path="setting" element={<Setting />} />
                  <Route path="master" element={<Master />} />

                  <Route path="department" element={<DepartmentPage />} />
                  <Route path="branch" element={<BranchPage />} />
                  <Route path="designation" element={<DesignationPage />} />
                  <Route path="roles" element={<Roles />} />
                  <Route path="/item-of-interest" element={<ItemOfInterestPage />} />
                   <Route path="/sections" element={<SectionPage />} />
                </Routes>

              </div>
            </ProtectedRoute>
          }
        />

      </Routes>

    </Router>
  )
}

export default App