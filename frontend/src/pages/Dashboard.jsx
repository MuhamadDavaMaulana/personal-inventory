import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [stats, setStats] = useState({
    total_items:      0,
    available:        0,
    borrowed:         0,
    total_categories: 0,
  })
  const [recentItems,  setRecentItems]  = useState([])
  const [recentLoans,  setRecentLoans]  = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [itemsRes, categoriesRes, loansRes] = await Promise.all([
          api.get('/items'),
          api.get('/categories'),
          api.get('/loans').catch(() => ({ data: [] })),
        ])
        const items = itemsRes.data ?? []
        const loans = loansRes.data ?? []

        setStats({
          total_items:      items.length,
          available:        items.filter(i => i.status === 'available').length,
          borrowed:         items.filter(i => i.status === 'borrowed').length,
          total_categories: categoriesRes.data?.length ?? 0,
        })

        setRecentItems([...items].reverse().slice(0, 5))
        setRecentLoans(
          loans.filter(l => l.status === 'active').slice(0, 5)
        )
      } catch (_) {}
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h >= 4  && h < 11) return 'Selamat Pagi'
    if (h >= 11 && h < 15) return 'Selamat Siang'
    if (h >= 15 && h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  const statCards = [
    {
      label:   'Total Barang',
      value:   stats.total_items,
      icon:    <BoxIcon />,
      bg:      'linear-gradient(135deg, #1E3A8A, #2563EB)',
      shadow:  'rgba(37,99,235,0.35)',
      link:    '/items',
    },
    {
      label:   'Tersedia',
      value:   stats.available,
      icon:    <CheckIcon />,
      bg:      'linear-gradient(135deg, #065F46, #059669)',
      shadow:  'rgba(5,150,105,0.3)',
      link:    '/items',
    },
    {
      label:   'Dipinjam',
      value:   stats.borrowed,
      icon:    <LoanIcon />,
      bg:      'linear-gradient(135deg, #92400E, #D97706)',
      shadow:  'rgba(217,119,6,0.3)',
      link:    '/loans',
    },
    {
      label:   'Kategori',
      value:   stats.total_categories,
      icon:    <CategoryIcon />,
      bg:      'linear-gradient(135deg, #4C1D95, #7C3AED)',
      shadow:  'rgba(124,58,237,0.3)',
      link:    '/categories',
    },
  ]

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
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }

        .stat-card:hover {
          transform:  translateY(-4px) !important;
          box-shadow: 0 16px 40px var(--card-shadow) !important;
        }
        .row-item:hover {
          background: #F8FAFF !important;
        }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Header ── */}
        <div style={{
          background:   'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 55%, #3B82F6 100%)',
          borderRadius: '20px',
          padding:      '32px 36px',
          marginBottom: '28px',
          position:     'relative',
          overflow:     'hidden',
          boxShadow:    '0 8px 32px rgba(29,78,216,0.28)',
          animation:    'fadeUp 0.4s ease both',
        }}>
          <div style={{
            position:     'absolute', top: '-40px', right: '-40px',
            width:        '200px',    height: '200px',
            borderRadius: '50%',
            background:   'rgba(255,255,255,0.05)',
          }} />
          <div style={{
            position:     'absolute', bottom: '-20px', right: '120px',
            width:        '120px',    height: '120px',
            borderRadius: '50%',
            background:   'rgba(255,255,255,0.04)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              color:         'rgba(255,255,255,0.65)',
              fontSize:      '13px',
              fontWeight:    600,
              marginBottom:  '6px',
              letterSpacing: '0.02em',
            }}>
              {greeting()},
            </p>
            <h1 style={{
              color:        '#ffffff',
              fontSize:     '26px',
              fontWeight:   800,
              margin:       '0 0 6px',
              letterSpacing: '-0.5px',
            }}>
              {user.name ?? 'Pengguna'} 👋
            </h1>
            <p style={{
              color:        'rgba(255,255,255,0.6)',
              fontSize:     '13.5px',
              margin:       0,
            }}>
              Berikut ringkasan inventaris barang pribadimu hari ini.
            </p>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap:                 '16px',
          marginBottom:        '28px',
          animation:           'fadeUp 0.45s ease 0.05s both',
        }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{
                  height:     '130px',
                  borderRadius: '16px',
                  background:   'linear-gradient(90deg, #E2E8F0 25%, #EEF2FF 50%, #E2E8F0 75%)',
                  backgroundSize: '600px 100%',
                  animation:    'shimmer 1.4s infinite',
                }} />
              ))
            : statCards.map((c, i) => (
                <Link
                  key={c.label}
                  to={c.link}
                  className="stat-card"
                  style={{
                    '--card-shadow':  c.shadow,
                    background:       c.bg,
                    borderRadius:     '18px',
                    padding:          '22px 20px',
                    textDecoration:   'none',
                    display:          'block',
                    boxShadow:        `0 6px 20px ${c.shadow}`,
                    transition:       'all 0.2s ease',
                    animation:        `fadeUp 0.4s ease ${0.08 * i}s both`,
                  }}
                >
                  <div style={{
                    width:        '40px', height: '40px',
                    borderRadius: '12px',
                    background:   'rgba(255,255,255,0.18)',
                    display:      'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '14px',
                    color:        '#ffffff',
                  }}>
                    {c.icon}
                  </div>
                  <div style={{
                    fontSize:   '32px',
                    fontWeight: 800,
                    color:      '#ffffff',
                    lineHeight: 1,
                    marginBottom: '5px',
                  }}>
                    {c.value}
                  </div>
                  <div style={{
                    fontSize:   '12.5px',
                    fontWeight: 600,
                    color:      'rgba(255,255,255,0.75)',
                    letterSpacing: '0.01em',
                  }}>
                    {c.label}
                  </div>
                </Link>
              ))
          }
        </div>

        {/* ── Body: 2 kolom ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:     '20px',
          animation: 'fadeUp 0.45s ease 0.15s both',
        }}>

          {/* ── Barang Terbaru ── */}
          <div style={{
            background:   '#ffffff',
            borderRadius: '18px',
            border:       '1px solid #E2E8F0',
            overflow:     'hidden',
            boxShadow:    '0 2px 12px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              padding:        '18px 20px 14px',
              borderBottom:   '1px solid #F1F5F9',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #EEF2FF, #DBEAFE)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BoxIcon color="#2563EB" size={16} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  Barang Terbaru
                </span>
              </div>
              <Link to="/items" style={{
                fontSize: '12px', fontWeight: 600,
                color: '#2563EB', textDecoration: 'none',
              }}>
                Lihat Semua →
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '16px 20px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{
                    height: '44px', borderRadius: '8px', marginBottom: '8px',
                    background: 'linear-gradient(90deg, #F1F5F9 25%, #F8FAFC 50%, #F1F5F9 75%)',
                    backgroundSize: '600px 100%', animation: 'shimmer 1.4s infinite',
                  }} />
                ))}
              </div>
            ) : recentItems.length === 0 ? (
              <EmptyState label="Belum ada barang" />
            ) : (
              <div>
                {recentItems.map((item, i) => (
                  <div
                    key={item.id ?? i}
                    className="row-item"
                    style={{
                      display:       'flex',
                      alignItems:    'center',
                      justifyContent: 'space-between',
                      padding:        '12px 20px',
                      borderBottom:   i < recentItems.length - 1
                        ? '1px solid #F8FAFF' : 'none',
                      transition:     'background 0.15s ease',
                      cursor:         'default',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px', height: '34px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #EEF2FF, #DBEAFE)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <BoxIcon color="#2563EB" size={15} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '13px', fontWeight: 600, color: '#0F172A',
                          maxWidth: '160px', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {item.name}
                        </div>
                        {item.category?.name && (
                          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>
                            {item.category.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Peminjaman Aktif ── */}
          <div style={{
            background:   '#ffffff',
            borderRadius: '18px',
            border:       '1px solid #E2E8F0',
            overflow:     'hidden',
            boxShadow:    '0 2px 12px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              padding:        '18px 20px 14px',
              borderBottom:   '1px solid #F1F5F9',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <LoanIcon color="#D97706" size={16} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  Peminjaman Aktif
                </span>
              </div>
              <Link to="/loans" style={{
                fontSize: '12px', fontWeight: 600,
                color: '#2563EB', textDecoration: 'none',
              }}>
                Lihat Semua →
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '16px 20px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{
                    height: '44px', borderRadius: '8px', marginBottom: '8px',
                    background: 'linear-gradient(90deg, #F1F5F9 25%, #F8FAFC 50%, #F1F5F9 75%)',
                    backgroundSize: '600px 100%', animation: 'shimmer 1.4s infinite',
                  }} />
                ))}
              </div>
            ) : recentLoans.length === 0 ? (
              <EmptyState label="Tidak ada peminjaman aktif" />
            ) : (
              <div>
                {recentLoans.map((loan, i) => (
                  <div
                    key={loan.id ?? i}
                    className="row-item"
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'space-between',
                      padding:        '12px 20px',
                      borderBottom:   i < recentLoans.length - 1
                        ? '1px solid #F8FAFF' : 'none',
                      transition:     'background 0.15s ease',
                      cursor:         'default',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px', height: '34px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <LoanIcon color="#D97706" size={15} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '13px', fontWeight: 600, color: '#0F172A',
                          maxWidth: '160px', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {loan.item?.name ?? loan.item_name ?? 'Barang'}
                        </div>
                        {loan.borrowed_to && (
                          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>
                            Kembali: {new Date(loan.borrowed_to).toLocaleDateString('id-ID', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <LoanStatusBadge status={loan.status} dueDate={loan.borrowed_to} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════════════════

function StatusBadge({ status }) {
  const map = {
    available: { label: 'Tersedia',  bg: '#ECFDF5', color: '#059669', dot: '#10B981' },
    borrowed:  { label: 'Dipinjam', bg: '#FFFBEB', color: '#D97706', dot: '#F59E0B' },
  }
  const s = map[status] ?? { label: status, bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px',
      background: s.bg, fontSize: '11px', fontWeight: 700, color: s.color,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%', background: s.dot,
      }} />
      {s.label}
    </span>
  )
}

function LoanStatusBadge({ status, dueDate }) {
  const isLate = dueDate && new Date(dueDate) < new Date()
  if (isLate) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '3px 10px', borderRadius: '20px',
        background: '#FEF2F2', fontSize: '11px', fontWeight: 700, color: '#DC2626',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
        Terlambat
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px',
      background: '#FFFBEB', fontSize: '11px', fontWeight: 700, color: '#D97706',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
      Aktif
    </span>
  )
}

function EmptyState({ label }) {
  return (
    <div style={{ padding: '36px 20px', textAlign: 'center' }}>
      <div style={{
        width: '44px', height: '44px',
        borderRadius: '12px',
        background: '#F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
      }}>
        <BoxIcon color="#94A3B8" size={20} />
      </div>
      <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500, margin: 0 }}>
        {label}
      </p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════

function BoxIcon({ size = 18, color = '#ffffff' }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color}
         viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function CheckIcon({ size = 18, color = '#ffffff' }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color}
         viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function LoanIcon({ size = 18, color = '#ffffff' }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color}
         viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

function CategoryIcon({ size = 18, color = '#ffffff' }) {
  return (
    <svg width={size} height={size} fill="none" stroke={color}
         viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M3 12h18M3 18h18"/>
      <circle cx="6" cy="6"  r="1" fill={color}/>
      <circle cx="6" cy="12" r="1" fill={color}/>
      <circle cx="6" cy="18" r="1" fill={color}/>
    </svg>
  )
}