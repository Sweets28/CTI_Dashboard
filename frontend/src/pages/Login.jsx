import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";


const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = () => {
        login(username, password)
        .then(res => {
            localStorage.setItem('token', res.data.access_token)
            navigate('/')
        })
        .catch(() => setError('Invalid Credentials'))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit()
    }

return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center"
        style={{
            backgroundImage: 'radial-gradient(circle at 70% 50%, #0d1424 0%, #030609 100%)',
            backgroundSize: 'cover'
        }}
        >
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-lg p-8">
            <div className="mb-8 text-center">
                <p className="text-green-500 font-mono text-xs tracking-widest mb-2">// CTI:OPS</p>
                <h1 className="text-white font-mono text-2xl font-bold">AUTHENTICATE</h1>
                <p className="text-gray-600 font-mono text-xs mt-2">SECURE ACCESS REQUIRED</p>
            </div>
            {error && <p className="text-red-400 font-mono text-xs mb-4 text-center">{error}</p>}
            <input
                type="text"
                placeholder="USERNAME"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded font-mono text-sm text-blue-400 placeholder-gray-700 focus:outline-none focus:border-blue-600 mb-3"
            />
            <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded font-mono text-sm text-blue-400 placeholder-gray-700 focus:outline-none focus:border-blue-600 mb-6"
            />
            <button
                onKeyDown={handleKeyDown}
                onClick={handleSubmit}
                className="w-full py-3 font-mono text-xs tracking-widest border border-green-700 text-green-400 hover:bg-green-900/20 rounded transition-all"
            >
                AUTHENTICATE →
            </button>
        </div>
    </div>
)
}

export default Login