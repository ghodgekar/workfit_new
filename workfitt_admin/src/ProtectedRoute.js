import React from 'react'
import { Navigate, Outlet } from "react-router-dom"

function checkLogin(){
    // console.log(typeof localStorage.getItem("Login"));
    if (localStorage.getItem("Login")&&localStorage.getItem("Login")=="true" ) return true
    return false
}



function ProtectedRoute() {
    let isAuthed = checkLogin()
    return !isAuthed ? <Navigate to="/login" /> : <Outlet />;
}

export default ProtectedRoute