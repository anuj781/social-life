import React, { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Nav from "./components/Nav"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { ToastContainer } from "react-toastify"
import { useDispatch, useSelector } from 'react-redux'
import Forget from "./pages/Forget"
import UserProfile from "./pages/UserProfile"
import FriendProfile from "./pages/FriendProfile"
import { fetchUserByToken } from './redux/userSlice'
import Chat from './pages/Chat'



function App() {
  let userSlice = useSelector((state)=>state.users);
  console.log(userSlice)
  let login = userSlice.login  // false
  let dispatch = useDispatch()

  useEffect(()=>{
   if(userSlice.token){
     dispatch(fetchUserByToken(userSlice.token))
   }
  },[userSlice.token])

  return (
    <div>
      <BrowserRouter>
      <Nav/>
      <Routes>

    
      <Route path='/' element={login===true ? <Home/> : <Navigate to={'/login'}/>}/>

      <Route path='/signup' element={login===false ? <Signup/> : <Navigate to={'/'}/>}/>
     <Route path='/login' element={login===false ? <Login/> : <Navigate to={'/'}/>}/>
      <Route path='/userProfile' element={login===true ? <UserProfile/> : <Navigate to={'/login'}/>}/>
      <Route path='/forget' element={<Forget/>}/>
      <Route path='/friendProfile' element={login===true ?<FriendProfile/> : <Navigate to={'/login'}/>}/>
      <Route path='/chat' element={login===true ?<Chat/> : <Navigate to={'/login'}/>}/>
      </Routes>
      <ToastContainer/>
      </BrowserRouter>
    </div>
  )
}

export default App
