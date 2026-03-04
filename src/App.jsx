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

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
     <Router>
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
       <Routes>
   <Route path="/" element={<Home />} />
   <Route path='/users' element={<User />} />
   <Route path="/tbt" element={<TBT />} />
   <Route path='/nearmiss' element={<NearMiss />} />
    <Route path='/linewalk' element={<LineWalk/>} />
     <Route path='/setting' element={<Setting />} />
      <Route path='/master' element={<Master />} />
      </Routes>
    </div>
    </Router>
  )
}

export default App