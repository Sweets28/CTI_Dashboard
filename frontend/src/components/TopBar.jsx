import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



const TopBar = () => {
    const [time, setTime] = useState('')
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate("/login")
    }

    useEffect(() => {
        const tick = () =>{
            const now = new Date()
            setTime(now.toUTCString().slice(17, 25) + ' UTC')
        }
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [])

    return(
        <div className="flex items-center justify-between px-6 h-14 bg-gray-900 border-b border-gray-800">
            <span className="font-mono text-green-400 tracking-widest text-sm">// CTI:OPS</span>
            <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="font-mono text-green-400 text-xs">LIVE</span>
                <span className="font-mono text-gray-500 text-xs">{time}</span>
                <button
                    onClick={handleLogout}
                    className="font-mono text-xs px-3 py-1 border border-red-900 text-red-400 hover:bg-red-900/20 rounded"
                >
                    LOGOUT
                </button>
            </div>
        </div>
    )
}


export default TopBar