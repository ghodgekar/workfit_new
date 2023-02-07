import React,{useState,useEffect} from 'react'
import { Navigate, } from "react-router-dom"

function Logout() {

    const [logOut, setlogOut] = useState(false)

    useEffect(() => {
        localStorage.removeItem("Login")
        setlogOut(true)
    }, [])

    return (
        <div>
            {logOut ? <Navigate to="/login" /> :
                "Logging Out"}
        </div>
    )
}

export default Logout