import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Profile() {
  const navigate   = useNavigate()
  const [user, setUser]         = useState(JSON.parse(localStorage.getItem('user') || '{}'))
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'password'

  // Profile form
  const [name,  setName]  = useState(user.name  ?? '')
  const [email, setEmail] = useState(user.email ?? '')
  const [profileMsg,   setProfileMsg]   = useState(null)
  const [profileError, setProfileError] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passMsg,   setPassMsg]   = useState(null)
  const [passError, setPassError] = useState(null)
  const [passLoading, setPassLoading] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileMsg(null)
    setProfileError(null)
    setProfileLoading(true)
    try {
      const res = await api.put('/profile', { name, email })
      const updated = res.data.user
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
      setProfileMsg('Profil berhasil diperbarui!')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        setProfileError(Object.values(errors).flat().join(' '))
      } else {
        setProfileError(err.response?.data?.message ?? 'Gagal memperbarui profil.')
      }
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPassMsg(null)
    setPassError(null)

    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi password tidak cocok.')
      return
    }

    setPassLoading(true)
    try {
      const res = await api.put('/profile/password', {
        current_password:          currentPassword,
        new_password:              newPassword,
        new_password_confirmation: confirmPassword,
      })
      // Update token baru
      localStorage.setItem('token', res.data.token)
      setPassMsg('Password berhasil diubah!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        setPassError(Object.values(errors).flat().join(' '))
      } else {
        setPassError(err.response?.data?.message ?? 'Gagal mengubah password.')
      }
    } finally {
      setPassLoading(false)
    }
  }

  // Inisial avatar
  const initials = (user.name ?? 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{
      minHeight:  '100vh',
      background: '#F0F4FF',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .input-field:focus {
          outline: none;
          border-color: #2563EB !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important;
        }
        .tab-btn:hover { background: #F1F5F9 !important; }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Header ── */}
        <div style={{
          background:   'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 55%, #3B82F6 100%)',
          borderRadius: '20px',
          padding:      '28px 32px',
          marginBottom: '24px',
          display:      'flex',
          alignItems:   'center',
          gap:          '20px',
          boxShadow:    '0 8px 32px rgba(29,78,216,0.28)',
          animation:    'fadeUp 0.4s ease both',
        }}>
          {/* Avatar */}
          <div style={{
            width:        '64px',
            height:       '64px',
            borderRadius: '50%',
            background:   'rgba(255,255,255,0.2)',
            border:       '2px solid rgba(255,255,255,0.4)',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            fontSize:     '22px',
            fontWeight:   800,
            color:        'white',
            flexShrink:   0,
          }}>
            {initials}
          </div>
          <div>
            <h1 style={{
              color:     'white',
              fontSize:  '20px',
              fontWeight: 800,
              margin:    '0 0 4px',
            }}>
              {user.name ?? 'Pengguna'}
            </h1>
            <p style={{
              color:   'rgba(255,255,255,0.65)',
              fontSize: '13px',
              margin:  0,
            }}>
              {user.email ?? ''}
            </p>
          </div>
        </div>

        {/* ── Tab ── */}
        <div style={{
          display:      'flex',
          gap:          '8px',
          marginBottom: '20px',
          animation:    'fadeUp 0.4s ease 0.05s both',
        }}>
          {[
            { key: 'profile',  label: '👤 Edit Profil' },
            { key: 'password', label: '🔒 Ganti Password' },
          ].map(tab => (
            <button
              key={tab.key}
              className="tab-btn"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding:      '9px 20px',
                borderRadius: '12px',
                border:       'none',
                cursor:       'pointer',
                fontSize:     '13px',
                fontWeight:   700,
                fontFamily:   "'Plus Jakarta Sans', sans-serif",
                transition:   'all 0.15s ease',
                background:   activeTab === tab.key
                  ? 'linear-gradient(135deg, #1E3A8A, #2563EB)'
                  : 'white',
                color:        activeTab === tab.key ? 'white' : '#475569',
                boxShadow:    activeTab === tab.key
                  ? '0 4px 14px rgba(37,99,235,0.3)'
                  : '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Form Card ── */}
        <div style={{
          background:   'white',
          borderRadius: '20px',
          border:       '1px solid #E2E8F0',
          padding:      '28px 32px',
          boxShadow:    '0 2px 12px rgba(0,0,0,0.05)',
          animation:    'fadeUp 0.4s ease 0.1s both',
        }}>

          {/* ── TAB: Edit Profil ── */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile}>
              <h2 style={{
                fontSize:     '16px',
                fontWeight:   700,
                color:        '#0F172A',
                margin:       '0 0 20px',
              }}>
                Informasi Profil
              </h2>

              {profileMsg && (
                <div style={{
                  background:   '#ECFDF5',
                  border:       '1px solid #6EE7B7',
                  color:        '#065F46',
                  borderRadius: '10px',
                  padding:      '10px 14px',
                  fontSize:     '13px',
                  fontWeight:   600,
                  marginBottom: '16px',
                }}>
                  
                </div>
              )}
              {profileError && (
                <div style={{
                  background:   '#FEF2F2',
                  border:       '1px solid #FCA5A5',
                  color:        '#991B1B',
                  borderRadius: '10px',
                  padding:      '10px 14px',
                  fontSize:     '13px',
                  fontWeight:   600,
                  marginBottom: '16px',
                }}>
                  
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display:      'block',
                  fontSize:     '13px',
                  fontWeight:   600,
                  color:        '#374151',
                  marginBottom: '6px',
                }}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{
                    width:        '100%',
                    padding:      '11px 14px',
                    borderRadius: '12px',
                    border:       '1.5px solid #E2E8F0',
                    fontSize:     '14px',
                    fontFamily:   "'Plus Jakarta Sans', sans-serif",
                    background:   '#FAFAFA',
                    boxSizing:    'border-box',
                    transition:   'all 0.2s ease',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display:      'block',
                  fontSize:     '13px',
                  fontWeight:   600,
                  color:        '#374151',
                  marginBottom: '6px',
                }}>
                  Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width:        '100%',
                    padding:      '11px 14px',
                    borderRadius: '12px',
                    border:       '1.5px solid #E2E8F0',
                    fontSize:     '14px',
                    fontFamily:   "'Plus Jakarta Sans', sans-serif",
                    background:   '#FAFAFA',
                    boxSizing:    'border-box',
                    transition:   'all 0.2s ease',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                style={{
                  width:        '100%',
                  padding:      '12px',
                  borderRadius: '12px',
                  border:       'none',
                  background:   profileLoading
                    ? '#93C5FD'
                    : 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                  color:        'white',
                  fontSize:     '14px',
                  fontWeight:   700,
                  fontFamily:   "'Plus Jakarta Sans', sans-serif",
                  cursor:       profileLoading ? 'not-allowed' : 'pointer',
                  boxShadow:    '0 4px 14px rgba(37,99,235,0.3)',
                  transition:   'all 0.2s ease',
                }}
              >
                {profileLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          )}

          {/* ── TAB: Ganti Password ── */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword}>
              <h2 style={{
                fontSize:   '16px',
                fontWeight: 700,
                color:      '#0F172A',
                margin:     '0 0 20px',
              }}>
                Ganti Password
              </h2>

              {passMsg && (
                <div style={{
                  background:   '#ECFDF5',
                  border:       '1px solid #6EE7B7',
                  color:        '#065F46',
                  borderRadius: '10px',
                  padding:      '10px 14px',
                  fontSize:     '13px',
                  fontWeight:   600,
                  marginBottom: '16px',
                }}>
                
                </div>
              )}
              {passError && (
                <div style={{
                  background:   '#FEF2F2',
                  border:       '1px solid #FCA5A5',
                  color:        '#991B1B',
                  borderRadius: '10px',
                  padding:      '10px 14px',
                  fontSize:     '13px',
                  fontWeight:   600,
                  marginBottom: '16px',
                }}>
                 
                </div>
              )}

              {[
                { label: 'Password Saat Ini', val: currentPassword, set: setCurrentPassword },
                { label: 'Password Baru',     val: newPassword,     set: setNewPassword },
                { label: 'Konfirmasi Password Baru', val: confirmPassword, set: setConfirmPassword },
              ].map((field, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? '16px' : '24px' }}>
                  <label style={{
                    display:      'block',
                    fontSize:     '13px',
                    fontWeight:   600,
                    color:        '#374151',
                    marginBottom: '6px',
                  }}>
                    {field.label}
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    value={field.val}
                    onChange={e => field.set(e.target.value)}
                    required
                    style={{
                      width:        '100%',
                      padding:      '11px 14px',
                      borderRadius: '12px',
                      border:       '1.5px solid #E2E8F0',
                      fontSize:     '14px',
                      fontFamily:   "'Plus Jakarta Sans', sans-serif",
                      background:   '#FAFAFA',
                      boxSizing:    'border-box',
                      transition:   'all 0.2s ease',
                    }}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={passLoading}
                style={{
                  width:        '100%',
                  padding:      '12px',
                  borderRadius: '12px',
                  border:       'none',
                  background:   passLoading
                    ? '#93C5FD'
                    : 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                  color:        'white',
                  fontSize:     '14px',
                  fontWeight:   700,
                  fontFamily:   "'Plus Jakarta Sans', sans-serif",
                  cursor:       passLoading ? 'not-allowed' : 'pointer',
                  boxShadow:    '0 4px 14px rgba(37,99,235,0.3)',
                  transition:   'all 0.2s ease',
                }}
              >
                {passLoading ? 'Mengubah...' : 'Ubah Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}