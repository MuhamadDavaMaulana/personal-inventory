import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../services/api'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = JSON.parse(localStorage.getItem('user') || '{}')

  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)

  const handleLogoutClick   = () => { setShowConfirm(true); setMenuOpen(false) }
  const handleCancel        = () => setShowConfirm(false)

  const handleConfirmLogout = async () => {
    setLoading(true)
    try { await api.post('/logout') } catch (_) {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const initials = user.name
    ? user.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'U'

  const navLinks = [
    { to: '/',           label: 'Dashboard',  icon: DashboardIcon },
    { to: '/categories', label: 'Kategori',   icon: CategoryIcon  },
    { to: '/items',      label: 'Barang',     icon: ItemIcon      },
    { to: '/loans',      label: 'Peminjaman', icon: LoanIcon      },
  ]

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .nav-link-desktop { display: flex !important; }
        .nav-user-desktop { display: flex !important; }
        .hamburger-btn    { display: none !important; }

        @media (max-width: 768px) {
          .nav-link-desktop { display: none !important; }
          .nav-user-desktop { display: none !important; }
          .hamburger-btn    { display: flex !important; }
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <nav style={{
        background:   'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 60%, #2563EB 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow:    '0 2px 20px rgba(29,78,216,0.25)',
        fontFamily:   "'Plus Jakarta Sans', sans-serif",
        position:     'sticky',
        top:          0,
        zIndex:       100,
      }}>
        <div style={{
          maxWidth:       '1280px',
          margin:         '0 auto',
          padding:        '0 16px',
          height:         '60px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '12px',
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>📦</div>
              <div>
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '15px', lineHeight: 1.1 }}>Personal</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Inventory</div>
              </div>
            </div>
          </Link>

          {/* ── Nav Links Desktop ── */}
          <div className="nav-link-desktop" style={{
            alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center',
          }}>
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = isActive(to)
              return (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '10px', textDecoration: 'none',
                  fontSize: '13.5px', fontWeight: active ? 700 : 500,
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}>
                  <Icon size={15} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* ── User + Logout Desktop ── */}
          <div className="nav-user-desktop" style={{ alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 12px 5px 6px', borderRadius: '40px',
                background: isActive('/profile') ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.10)',
                border: isActive('/profile') ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.18)',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 800, color: '#ffffff',
                }}>
                  {initials}
                </div>
                <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name || 'User'}
                </span>
              </div>
            </Link>

            <button onClick={handleLogoutClick} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '10px',
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <LogoutIcon size={14} />
              Logout
            </button>
          </div>

          {/* ── Hamburger Button Mobile ── */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer', color: '#ffffff',
              flexShrink: 0,
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* ── Mobile Dropdown Menu ── */}
        {menuOpen && (
          <div style={{
            background: 'linear-gradient(180deg, #1D4ED8, #1E3A8A)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '12px 16px 16px',
            animation: 'slideDown 0.2s ease',
          }}>
            {/* User info */}
            <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                marginBottom: '10px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 800, color: '#ffffff', flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>{user.name || 'User'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Lihat Profil</div>
                </div>
              </div>
            </Link>

            {/* Nav links */}
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = isActive(to)
              return (
                <Link
                  key={to} to={to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '11px 14px', borderRadius: '10px',
                    textDecoration: 'none', marginBottom: '4px',
                    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.7)',
                    fontWeight: active ? 700 : 500, fontSize: '14px',
                    border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                  }}
                >
                  <Icon size={17} />
                  {label}
                </Link>
              )
            })}

            {/* Logout */}
            <button
              onClick={handleLogoutClick}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '11px 14px', borderRadius: '10px',
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#FCA5A5', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', marginTop: '8px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <LogoutIcon size={16} />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* ── Modal Konfirmasi Logout ── */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          animation: 'fadeInOverlay 0.15s ease',
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '360px', margin: '0 16px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
            animation: 'slideUpModal 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: '#FEF2F2', border: '1px solid #FECACA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LogoutIconLarge />
              </div>
            </div>
            <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
              Keluar dari Akun?
            </h2>
            <p style={{ textAlign: 'center', fontSize: '13.5px', color: '#64748B', margin: '0 0 24px', lineHeight: 1.6 }}>
              Kamu akan keluar sebagai{' '}
              <span style={{ fontWeight: 700, color: '#1E3A8A' }}>{user.name}</span>. Yakin ingin melanjutkan?
            </p>
            <div style={{ height: '1px', background: '#F1F5F9', margin: '0 -32px 24px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleCancel} disabled={loading} style={{
                flex: 1, padding: '11px 16px', borderRadius: '12px',
                border: '1.5px solid #E2E8F0', background: '#F8FAFC',
                color: '#475569', fontSize: '13.5px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                Batal
              </button>
              <button onClick={handleConfirmLogout} disabled={loading} style={{
                flex: 1, padding: '11px 16px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                color: '#ffffff', fontSize: '13.5px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {loading ? 'Keluar...' : <><LogoutIcon size={14} /> Ya, Keluar</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Icons ──────────────────────────────────────────────────────

function MenuIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function DashboardIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

function CategoryIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M3 12h18M3 18h18"/>
      <circle cx="6" cy="6"  r="1" fill="currentColor"/>
      <circle cx="6" cy="12" r="1" fill="currentColor"/>
      <circle cx="6" cy="18" r="1" fill="currentColor"/>
    </svg>
  )
}

function ItemIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function LoanIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

function ProfileIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="rgba(255,255,255,0.7)" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function LogoutIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

function LogoutIconLarge() {
  return (
    <svg width="24" height="24" fill="none" stroke="#EF4444" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}