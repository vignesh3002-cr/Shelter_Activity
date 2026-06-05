import { useState } from 'react'
import axios from 'axios'


export default function LoginPage({ onLogin }) {
  const [UserID, setUserID]       = useState('')
  const [password, setPassword] = useState('')
  const isValid = password.length >= 8;
  const isTouched = password.length > 0;
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const[value,setValue] = useState(null)
  const[error,setError] = useState('')
  const API = import.meta.env.VITE_API_URL;
  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true)
    try{
      if (!UserID || !password) {
        if(!UserID) setError("Please enter UserID.");
        else if(!password) setError("Please enter Password.");
        setLoading(false);
        return;
      }

    const res=await axios.post(`${API}/api/auth/login`, { UserID, password });
    console.log(res.data);
    setValue(res.data);
 // Adjust based on actual response structure
    if (res.data["Login status"] === "YES") {

  localStorage.setItem("usermail",UserID);
  localStorage.setItem("password",password);
  localStorage.setItem(
    "username",
    res.data["User Name"]
  );


  onLogin(value);

}else{
      setError("Invalid UserID or Password");
    }
    setLoading(false)
  } catch (error) {
    console.error("Login error:", error);
    setError("SERVER ERROR");
    setLoading(false)
  }
  }
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md px-8 py-10 bg-gray-100 rounded-2xl animate-fade-up">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-white border border-gray-200 shadow-sm rounded-xl">
            {/* Logo mark — S icon */}
            <img src='/Shelter_logo.png' alt="Shelter Logo" className="w-9 h-9"/>
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight tracking-widest text-gray-900 uppercase">
              Shelter Group
            </div>
            <div className="text-xs text-gray-400 tracking-wide mt-0.5">Analytics Platform</div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-4xl font-bold leading-tight tracking-tight text-gray-950">
          Sign in to<br/>project workspace
        </h1>
        <p className="mb-8 text-sm tracking-wide text-gray-400">
          Track, Analyze, and Visualize your data..
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-2 font-mono text-xs tracking-widest text-gray-400">
              UserID
            </label>
            <div className="flex items-center gap-3 px-4 transition-colors bg-white border border-gray-200 rounded-xl h-14 focus-within:border-gray-400">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <rect x="1.5" y="3.5" width="15" height="11" rx="2.5" stroke="#ABABAB" strokeWidth="1.4"/>
                <path d="M1.5 6.5l7.5 5 7.5-5" stroke="#ABABAB" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={UserID}
                onChange={e => setUserID(e.target.value)}
                placeholder="hello@Shelter.co"
                className="flex-1 font-sans text-sm text-gray-800 placeholder-gray-300 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-mono text-xs tracking-widest text-gray-400">
              Password
            </label>
            <div className={`flex items-center gap-3 px-4 transition-colors bg-white border border-gray-200 rounded-xl h-14    ${!isTouched
              ? "focus-within:border-gray-400"
              : isValid
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
            }`}>
              {!isTouched ?              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <rect x="3.5" y="8" width="11" height="8" rx="2" stroke="#ABABAB" strokeWidth="1.4"/>
                <path d="M6 8V6a3 3 0 016 0v2" stroke="#ABABAB" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="9" cy="12" r="1.2" fill="#ABABAB"/>
              </svg> : isValid ? (
            // ✅ Success icon
            <svg width="18" height="18" fill="green" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" stroke="green" strokeWidth="3" fill="none"/>
            </svg>
          ) : (
            // ❌ Error icon
            <svg width="18" height="18" fill="red" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="red" strokeWidth="3"/>
            </svg>
          )}
 
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Must be 8 characters"
                className="flex-1 font-sans text-sm text-gray-800 placeholder-gray-300 bg-transparent outline-none no-eye"
              />
              <button type="button" onClick={() => setShowPw(p => !p)} className="flex-shrink-0">
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 9s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="#ABABAB" strokeWidth="1.4"/>
                    <circle cx="9" cy="9" r="2" stroke="#ABABAB" strokeWidth="1.4"/>
                    <line x1="3" y1="15" x2="15" y2="3" stroke="#ABABAB" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 9s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="#ABABAB" strokeWidth="1.4"/>
                    <circle cx="9" cy="9" r="2" stroke="#ABABAB" strokeWidth="1.4"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && (
          <p className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg bg-red-50" >
            {error}
          </p>
        )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gray-950 text-white rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-3 hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-70"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            ) : (
              <>
                Sign In
                <span className="flex items-center justify-center border rounded-full w-7 h-7 border-white/40">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5.5 2L8 5l-2.5 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-8 font-mono text-xs tracking-wide text-center text-gray-300">
          Shelter Group © 2025 · Analytics Platform
        </p>
      </div>
    </div>
  )
}