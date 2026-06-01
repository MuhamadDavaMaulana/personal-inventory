import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'white', border: '1.5px solid #E2E8F0',
    borderRadius: '12px', padding: '13px 14px 13px 44px',
    color: '#0F172A', fontSize: '14.5px',
    outline: 'none', transition: 'all 0.18s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  }

  const handleFocus = e => {
    e.target.style.border = '1.5px solid #2563EB'
    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'
  }
  const handleBlur = e => {
    e.target.style.border = '1.5px solid #E2E8F0'
    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: '#F0F4FF',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── Left Panel ── */}
      <div style={{
        flex: 1, display: 'none',
        background: 'linear-gradient(145deg, #1D4ED8 0%, #1E40AF 40%, #1E3A8A 100%)',
        padding: '60px', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }} className="left-panel">

        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '80px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '60px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
            padding: '10px 16px', backdropFilter: 'blur(8px)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '15px' }}>Personal Inventory</span>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: 'white', fontSize: '38px', fontWeight: '800', lineHeight: 1.2, margin: '0 0 16px' }}>
            Mulai Perjalanan<br />Inventaris Anda<br />Hari Ini
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
            Daftar gratis dan mulai kelola semua aset Anda dalam satu platform yang mudah digunakan.
          </p>

          {/* Benefit list */}
          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              'Lacak semua barang secara real-time',
              'Laporan & analitik lengkap',
              'Akses dari mana saja, kapan saja',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel / Form ── */}
      <div style={{
        width: '100%', maxWidth: '480px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px',
      }}>
        <div style={{ width: '100%' }}>

          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <span style={{ fontWeight: '800', fontSize: '16px', color: '#1E3A8A' }}>Personal Inventory</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px', lineHeight: 1.2 }}>
            Buat akun baru
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', margin: '0 0 28px' }}>
            Isi data berikut untuk memulai. Gratis selamanya!
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: '13.5px', color: '#B91C1C', lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Nama */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Nama Lengkap
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Alamat Email
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                    color: '#9CA3AF', display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#2563EB'}
                  onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}
                >
                  {showPass ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {/* Password hint */}
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', marginBottom: 0 }}>
                Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#93C5FD' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                border: 'none', borderRadius: '12px',
                color: 'white', fontSize: '15px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: loading ? 'none' : '0 6px 20px rgba(37,99,235,0.35)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                letterSpacing: '0.01em',
              }}
              onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(37,99,235,0.45)'; } }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 6px 20px rgba(37,99,235,0.35)'; }}
            >
              {loading ? (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                    style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  Buat Akun
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '500' }}>sudah punya akun?</span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </div>

          {/* Login link */}
          <Link
            to="/login"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '13px',
              background: 'white', border: '1.5px solid #E2E8F0',
              borderRadius: '12px', color: '#1E3A8A',
              fontSize: '15px', fontWeight: '600',
              textDecoration: 'none', transition: 'all 0.18s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              boxSizing: 'border-box',
            }}
            onMouseOver={e => { e.currentTarget.style.border = '1.5px solid #2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
            onMouseOut={e => { e.currentTarget.style.border = '1.5px solid #E2E8F0'; e.currentTarget.style.background = 'white'; }}
          >
            Masuk ke akun saya
          </Link>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', margin: '20px 0 0' }}>
            Dengan mendaftar, Anda menyetujui{' '}
            <a href="#" style={{ color: '#2563EB', textDecoration: 'none' }}>Syarat & Ketentuan</a>
            {' '}dan{' '}
            <a href="#" style={{ color: '#2563EB', textDecoration: 'none' }}>Kebijakan Privasi</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #CBD5E1; }
        @media (min-width: 900px) {
          .left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  )
}