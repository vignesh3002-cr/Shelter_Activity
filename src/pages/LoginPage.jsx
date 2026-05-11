import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin() }, 900)
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md px-8 py-10 bg-gray-100 rounded-2xl animate-fade-up">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-4">
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
              User Email
            </label>
            <div className="flex items-center gap-3 px-4 transition-colors bg-white border border-gray-200 rounded-xl h-14 focus-within:border-gray-400">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <rect x="1.5" y="3.5" width="15" height="11" rx="2.5" stroke="#ABABAB" strokeWidth="1.4"/>
                <path d="M1.5 6.5l7.5 5 7.5-5" stroke="#ABABAB" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
            <div className="flex items-center gap-3 px-4 transition-colors bg-white border border-gray-200 rounded-xl h-14 focus-within:border-gray-400">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <rect x="3.5" y="8" width="11" height="8" rx="2" stroke="#ABABAB" strokeWidth="1.4"/>
                <path d="M6 8V6a3 3 0 016 0v2" stroke="#ABABAB" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="9" cy="12" r="1.2" fill="#ABABAB"/>
              </svg>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 font-sans text-sm text-gray-800 placeholder-gray-300 bg-transparent outline-none"
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

          {/* Forgot */}
          <div className="text-right">
            <button type="button" className="font-mono text-xs text-gray-400 transition-colors hover:text-gray-600">
              Forgot password?
            </button>
          </div>

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