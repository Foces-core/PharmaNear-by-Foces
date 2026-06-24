import { useState } from 'react'
import './LoginPage.css'
import { Link, useNavigate } from 'react-router-dom'

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

function SignupPage() {
  const [userName, setUserName] = useState('')
  const [owner, setOwner] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/pharmacy/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userName,
          owner_name: owner,
          city: city,
          phone_number: phone,
          password: password,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Signup failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json()

      localStorage.setItem('pharmacy_user_name', data.pharmacy.user_name)
      localStorage.setItem('pharmacy_token', data.token)
      localStorage.setItem('pharmacy_id', data.pharmacy.id)

      navigate('/pharmacy')
    } catch (error) {
      setError(error.message)
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-layout">
      <div className="login-layout__left" />
      <div className="login-layout__right">
        <div className="login-card">
          <h1 className="login-title">SIGN UP</h1>
          <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
            <div className="input-group">
              <span className="input-icon input-icon--left" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M4 22C4 18.134 7.13401 15 11 15H13C16.866 15 20 18.134 20 22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type="text"
                name="userName"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-icon input-icon--left" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M4 22C4 18.134 7.13401 15 11 15H13C16.866 15 20 18.134 20 22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type="text"
                name="owner"
                placeholder="Owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-icon input-icon--left" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V8C2 6.9 2.9 6 4 6Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 8L12 13L2 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-icon input-icon--left" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V8C2 6.9 2.9 6 4 6Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 8L12 13L2 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-icon input-icon--left" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="input-icon input-icon--right btn-reset"
                onClick={() => setShowPassword((v) => !v)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12C3.8 7.6 7.6 5 12 5C16.4 5 20.2 7.6 22 12C20.2 16.4 16.4 19 12 19C7.6 19 3.8 16.4 2 12Z" stroke="currentColor" strokeWidth="1.7"/>
                  <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7"/>
                </svg>
              </button>
            </div>

            <div className="input-group">
              <span className="input-icon input-icon--left" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="error-message" style={{ 
                color: '#dc3545', 
                fontSize: '0.9rem', 
                textAlign: 'center', 
                marginBottom: '10px',
                padding: '8px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="signup-row">
              Already have an account?{' '}
              <Link to="/login" className="link-btn" style={{ textDecoration: 'none' }}>Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupPage


