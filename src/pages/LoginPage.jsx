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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-100 rounded-2xl px-8 py-10 animate-fade-up">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm flex-shrink-0">
            {/* Logo mark — S icon */}
            <img src='/Shelter_logo.png' alt="Shelter Logo" className="w-9 h-9"/>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-widest text-gray-900 uppercase leading-tight">
              Shelter Group
            </div>
            <div className="text-xs text-gray-400 tracking-wide mt-0.5">Analytics Platform</div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-950 leading-tight mb-3 tracking-tight">
          Sign in to<br/>project workspace
        </h1>
        <p className="text-sm text-gray-400 mb-8 tracking-wide">
          Track, Analyze, and Visualize your data..
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block font-mono text-xs text-gray-400 tracking-widest mb-2">
              User Email
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl h-14 px-4 focus-within:border-gray-400 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <rect x="1.5" y="3.5" width="15" height="11" rx="2.5" stroke="#ABABAB" strokeWidth="1.4"/>
                <path d="M1.5 6.5l7.5 5 7.5-5" stroke="#ABABAB" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hello@Shelter.co"
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-300 outline-none font-sans"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-mono text-xs text-gray-400 tracking-widest mb-2">
              Password
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl h-14 px-4 focus-within:border-gray-400 transition-colors">
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
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-300 outline-none font-sans"
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
            <button type="button" className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-mono">
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
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            ) : (
              <>
                Sign In
                <span className="w-7 h-7 border border-white/40 rounded-full flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5.5 2L8 5l-2.5 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-300 mt-8 font-mono tracking-wide">
          Shelter Group © 2025 · Analytics Platform
        </p>
      </div>
    </div>
  )
}