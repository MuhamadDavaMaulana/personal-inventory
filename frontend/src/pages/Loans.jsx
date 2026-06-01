import { useEffect, useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const STATUS_MAP = {
  active:   { label: 'Dipinjam',     bg: '#FFEDD5', color: '#C2410C' },
  returned: { label: 'Dikembalikan', bg: '#D1FAE5', color: '#065F46' },
  late:     { label: 'Terlambat',    bg: '#FEE2E2', color: '#991B1B' },
}

const EMPTY_FORM = {
  item_id: '', borrower_name: '', borrowed_at: '', due_date: '', note: '',
}

const fmt = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getLoanStatus = (loan) => {
  if (loan.returned_at) return 'returned'
  if (loan.due_date && new Date(loan.due_date) < new Date()) return 'late'
  return 'active'
}

function Badge({ status }) {
  const cfg = STATUS_MAP[status]
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
    }}>{cfg.label}</span>
  )
}

function SkeletonRow() {
  return (
    <tr>
      {[180, 130, 90, 90, 90, 70].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px', textAlign: i > 1 ? 'center' : 'left' }}>
          <div style={{
            height: 13, width: w, borderRadius: 6, margin: i > 1 ? '0 auto' : 0,
            background: 'linear-gradient(90deg,#E5E7EB 25%,#F9FAFB 50%,#E5E7EB 75%)',
            backgroundSize: '200%', animation: 'shimmer 1.4s infinite',
          }} />
        </td>
      ))}
    </tr>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: 16,
      border: '1.5px solid #E5E7EB', marginBottom: 10,
    }}>
      {[140, 100, 80].map((w, i) => (
        <div key={i} style={{
          height: 13, width: w, borderRadius: 6, marginBottom: 10,
          background: 'linear-gradient(90deg,#E5E7EB 25%,#F9FAFB 50%,#E5E7EB 75%)',
          backgroundSize: '200%', animation: 'shimmer 1.4s infinite',
        }} />
      ))}
    </div>
  )
}

// ── PERBAIKAN: FormField dipindah ke luar LoanModal ──────────────────────────
function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={s.label}>{label}</label>
      {children}
      {error && <p style={s.errText}>{error}</p>}
    </div>
  )
}

function LoanModal({ isOpen, onClose, onSubmit, allItems }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0]
      setForm({ ...EMPTY_FORM, borrowed_at: today })
      setErrors({})
    }
  }, [isOpen])

  if (!isOpen) return null

  const availableItems = allItems.filter(i => i.status === 'available')

  const validate = () => {
    const e = {}
    if (!form.item_id) e.item_id = 'Pilih barang.'
    if (!form.borrower_name.trim()) e.borrower_name = 'Nama peminjam wajib diisi.'
    if (!form.borrowed_at) e.borrowed_at = 'Tanggal pinjam wajib diisi.'
    if (form.due_date && form.due_date < form.borrowed_at) e.due_date = 'Batas kembali tidak boleh sebelum tanggal pinjam.'
    return e
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    await onSubmit(form)
    setSaving(false)
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...s.modal, margin: '0 16px' }}>
        <div style={s.mHead}>
          <h2 style={s.mTitle}>📋 Catat Peminjaman</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.mBody}>
          <FormField label="Barang *" error={errors.item_id}>
            <select style={{ ...s.input, ...(errors.item_id ? s.inputErr : {}) }}
              value={form.item_id}
              onChange={e => setForm({ ...form, item_id: e.target.value })}>
              <option value="">Pilih Barang Tersedia</option>
              {availableItems.map(i => (
                <option key={i.item_id} value={i.item_id}>{i.name}</option>
              ))}
            </select>
            {availableItems.length === 0 && (
              <p style={{ fontSize: 12, color: '#D97706', marginTop: 4 }}>
                ⚠️ Tidak ada barang tersedia saat ini.
              </p>
            )}
          </FormField>

          <FormField label="Nama Peminjam *" error={errors.borrower_name}>
            <input style={{ ...s.input, ...(errors.borrower_name ? s.inputErr : {}) }}
              placeholder="Contoh: Budi Santoso"
              value={form.borrower_name}
              onChange={e => setForm({ ...form, borrower_name: e.target.value })} />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Tanggal Pinjam *" error={errors.borrowed_at}>
              <input type="date" style={{ ...s.input, ...(errors.borrowed_at ? s.inputErr : {}) }}
                value={form.borrowed_at}
                onChange={e => setForm({ ...form, borrowed_at: e.target.value })} />
            </FormField>
            <FormField label="Batas Kembali" error={errors.due_date}>
              <input type="date" style={{ ...s.input, ...(errors.due_date ? s.inputErr : {}) }}
                value={form.due_date}
                onChange={e => setForm({ ...form, due_date: e.target.value })} />
            </FormField>
          </div>

          <FormField label="Catatan">
            <textarea style={{ ...s.input, height: 64, resize: 'none' }}
              placeholder="Catatan tambahan (opsional)..."
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })} />
          </FormField>
        </div>
        <div style={s.mFoot}>
          <button style={s.cancelBtn} onClick={onClose}>Batal</button>
          <button style={{ ...s.primaryBtn, opacity: saving ? 0.7 : 1 }}
            onClick={submit} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Catat Peminjaman'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ReturnModal({ loan, onClose, onConfirm }) {
  const [saving, setSaving] = useState(false)
  if (!loan) return null

  const status = getLoanStatus(loan)
  const isLate = status === 'late'

  const confirm = async () => {
    setSaving(true)
    await onConfirm(loan.loan_id)
    setSaving(false)
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...s.modal, maxWidth: 420, margin: '0 16px' }}>
        <div style={s.mHead}>
          <h2 style={{ ...s.mTitle, color: '#059669' }}>✅ Konfirmasi Pengembalian</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>{isLate ? '⚠️' : '📦'}</div>
          <p style={{ color: '#374151', fontSize: 15, marginBottom: 8 }}>
            Tandai <strong>"{loan.item?.name || '—'}"</strong> sudah dikembalikan oleh{' '}
            <strong>{loan.borrower_name}</strong>?
          </p>
          {isLate && (
            <div style={{
              background: '#FEF2F2', border: '1.5px solid #FECACA',
              borderRadius: 10, padding: '10px 14px', marginTop: 10,
            }}>
              <p style={{ color: '#DC2626', fontSize: 13, margin: 0, fontWeight: 600 }}>
                ⚠️ Peminjaman ini sudah melewati batas kembali ({fmt(loan.due_date)})
              </p>
            </div>
          )}
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 12 }}>
            Tanggal kembali akan dicatat sebagai <strong>{fmt(new Date().toISOString().split('T')[0])}</strong>
          </p>
        </div>
        <div style={s.mFoot}>
          <button style={s.cancelBtn} onClick={onClose}>Batal</button>
          <button style={{ ...s.primaryBtn, background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 4px 12px #05966933', opacity: saving ? 0.7 : 1 }}
            onClick={confirm} disabled={saving}>
            {saving ? 'Memproses...' : 'Ya, Sudah Kembali'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteModal({ loan, onClose, onConfirm }) {
  if (!loan) return null
  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...s.modal, maxWidth: 400, margin: '0 16px' }}>
        <div style={s.mHead}>
          <h2 style={{ ...s.mTitle, color: '#DC2626' }}>Hapus Catatan</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🗑️</div>
          <p style={{ color: '#374151', fontSize: 15 }}>
            Yakin hapus catatan peminjaman <strong>"{loan.item?.name || '—'}"</strong> oleh{' '}
            <strong>{loan.borrower_name}</strong>?
          </p>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 6 }}>
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div style={s.mFoot}>
          <button style={s.cancelBtn} onClick={onClose}>Batal</button>
          <button style={{ ...s.primaryBtn, background: '#DC2626', boxShadow: '0 4px 12px #DC262633' }}
            onClick={() => onConfirm(loan.loan_id)}>
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

function LoanCard({ loan, onReturn, onDelete }) {
  const isLate = loan._status === 'late'
  const isDone = loan._status === 'returned'

  return (
    <div style={{
      background: isLate ? '#FFF7F7' : '#fff',
      borderRadius: 14, padding: 16,
      border: `1.5px solid ${isLate ? '#FECACA' : '#E5E7EB'}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1, marginRight: 8 }}>
          <p style={{ fontWeight: 700, color: '#1E3A8A', margin: 0, fontSize: 14 }}>
            {loan.item?.name || '—'}
          </p>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
            👤 {loan.borrower_name}
          </p>
        </div>
        <Badge status={loan._status} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', borderRadius: 6, padding: '2px 8px' }}>
          📅 Pinjam: {fmt(loan.borrowed_at)}
        </span>
        {loan.due_date && (
          <span style={{
            fontSize: 12, borderRadius: 6, padding: '2px 8px',
            background: isLate ? '#FEE2E2' : '#F3F4F6',
            color: isLate ? '#991B1B' : '#6B7280',
            fontWeight: isLate ? 700 : 400,
          }}>
            {isLate ? '⚠️' : '🔔'} Kembali: {fmt(loan.due_date)}
          </span>
        )}
        {loan.returned_at && (
          <span style={{ fontSize: 12, color: '#059669', background: '#D1FAE5', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>
            ✅ Kembali: {fmt(loan.returned_at)}
          </span>
        )}
      </div>

      {loan.note && (
        <p style={{ fontSize: 12, color: '#9CA3AF', fontStyle: 'italic', marginBottom: 10, margin: '0 0 10px' }}>
          📝 {loan.note}
        </p>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {!isDone && (
          <button onClick={() => onReturn(loan)} style={{
            flex: 1, padding: '8px', borderRadius: 8,
            background: '#ECFDF5', color: '#059669',
            border: '1.5px solid #A7F3D0',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans',sans-serif",
          }}>Kembalikan</button>
        )}
        <button onClick={() => onDelete(loan)} style={{
          flex: 1, padding: '8px', borderRadius: 8,
          background: '#FEF2F2', color: '#DC2626',
          border: '1.5px solid #FECACA',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}>Hapus</button>
      </div>
    </div>
  )
}

export default function Loans() {
  const [loans, setLoans] = useState([])
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loanModal, setLoanModal] = useState(false)
  const [returnTarget, setReturnTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [loansRes, itemsRes] = await Promise.all([
        api.get('/loans'),
        api.get('/items'),
      ])
      setLoans(loansRes.data)
      setAllItems(itemsRes.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const loansWithStatus = useMemo(() =>
    loans.map(l => ({ ...l, _status: getLoanStatus(l) }))
  , [loans])

  const filtered = useMemo(() => {
    return loansWithStatus.filter(loan => {
      const q = search.toLowerCase()
      if (q &&
        !(loan.item?.name || '').toLowerCase().includes(q) &&
        !loan.borrower_name.toLowerCase().includes(q)) return false
      if (filterStatus && loan._status !== filterStatus) return false
      return true
    })
  }, [loansWithStatus, search, filterStatus])

  const activeFilters = [search, filterStatus].filter(Boolean).length

  const stats = useMemo(() => ({
    total:    loans.length,
    active:   loansWithStatus.filter(l => l._status === 'active').length,
    late:     loansWithStatus.filter(l => l._status === 'late').length,
    returned: loansWithStatus.filter(l => l._status === 'returned').length,
  }), [loansWithStatus])

  const handleAdd = async (form) => {
    try {
      await api.post('/loans', form)
      setLoanModal(false)
      fetchAll()
    } catch {}
  }

  const handleReturn = async (id) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      await api.put(`/loans/${id}`, { returned_at: today })
      setReturnTarget(null)
      fetchAll()
    } catch {}
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/loans/${id}`)
      setDeleteTarget(null)
      fetchAll()
    } catch {}
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; }
        tr.loan-row:hover td { background:#EEF4FF !important; }

        .loans-desktop { display: block; }
        .loans-mobile  { display: none; flex-direction: column; gap: 10px; }
        .stats-grid    { grid-template-columns: repeat(4, 1fr); }
        .page-header   { flex-direction: row; align-items: flex-start; }
        .page-padding  { padding: 32px 24px; }

        @media (max-width: 768px) {
          .loans-desktop { display: none !important; }
          .loans-mobile  { display: flex !important; }
          .stats-grid    { grid-template-columns: repeat(2, 1fr) !important; }
          .page-header   { flex-direction: column !important; gap: 12px; }
          .page-padding  { padding: 16px 12px !important; }
        }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto' }} className="page-padding">

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }} className="page-header">
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1E3A8A', margin: 0 }}>🔄 Peminjaman</h1>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>Kelola catatan peminjaman barang</p>
          </div>
          <button style={s.primaryBtn} onClick={() => setLoanModal(true)}>
            + Catat Peminjaman
          </button>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gap: 12, marginBottom: 20 }} className="stats-grid">
          {[
            { label: 'Total',        value: stats.total,    color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Aktif',        value: stats.active,   color: '#D97706', bg: '#FFFBEB' },
            { label: 'Terlambat',    value: stats.late,     color: '#DC2626', bg: '#FEF2F2' },
            { label: 'Dikembalikan', value: stats.returned, color: '#059669', bg: '#ECFDF5' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: stat.bg, borderRadius: 12, padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1.5px solid ${stat.color}22`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: stat.color,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>{stat.value}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '14px 18px',
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
          marginBottom: 16, boxShadow: '0 2px 10px #1E3A8A0A',
          border: '1.5px solid #E5E7EB',
        }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
            <input style={{ ...s.filterInput, paddingLeft: 32 }}
              placeholder="Cari barang / peminjam..."
              value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <select style={{ ...s.filterInput, flex: '1 1 140px', minWidth: 0 }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="active">Dipinjam</option>
            <option value="late">Terlambat</option>
            <option value="returned">Dikembalikan</option>
          </select>
          {activeFilters > 0 && (
            <button style={{
              padding: '8px 14px', borderRadius: 8, border: '1.5px solid #FCA5A5',
              background: '#FEF2F2', color: '#DC2626', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", whiteSpace: 'nowrap',
            }} onClick={() => { setSearch(''); setFilterStatus('') }}>
              ✕ Reset ({activeFilters})
            </button>
          )}
        </div>

        {/* Result count */}
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
          Menampilkan <strong style={{ color: '#1E3A8A' }}>{filtered.length}</strong> dari {loans.length} catatan
        </p>

        {/* ── Desktop Table ── */}
        <div className="loans-desktop" style={{
          background: '#fff', borderRadius: 16,
          boxShadow: '0 2px 16px #1E3A8A0D', overflow: 'hidden',
          border: '1.5px solid #E5E7EB',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
                {['Barang', 'Peminjam', 'Tgl Pinjam', 'Batas Kembali', 'Tgl Kembali', 'Status', 'Aksi'].map((h, i) => (
                  <th key={h} style={{
                    padding: '14px 16px', color: '#fff', fontWeight: 700,
                    textAlign: i > 1 ? 'center' : 'left', fontSize: 13,
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '52px', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
                    <p style={{ color: '#374151', fontWeight: 600, fontSize: 15 }}>
                      {activeFilters > 0 ? 'Tidak ada catatan yang cocok' : 'Belum ada peminjaman'}
                    </p>
                    <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>
                      {activeFilters > 0 ? 'Coba ubah filter.' : 'Klik "+ Catat Peminjaman" untuk memulai.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((loan, i) => {
                  const isLate = loan._status === 'late'
                  const isDone = loan._status === 'returned'
                  return (
                    <tr key={loan.loan_id} className="loan-row" style={{
                      borderTop: i === 0 ? 'none' : '1px solid #F3F4F6',
                      transition: 'background .12s',
                      background: isLate ? '#FFF7F7' : 'transparent',
                    }}>
                      <td style={{ padding: '13px 16px' }}>
                        <p style={{ fontWeight: 700, color: '#1E3A8A', margin: 0 }}>{loan.item?.name || '—'}</p>
                        {loan.note && (
                          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', fontStyle: 'italic' }}>{loan.note}</p>
                        )}
                      </td>
                      <td style={{ padding: '13px 16px', color: '#374151', fontWeight: 600 }}>{loan.borrower_name}</td>
                      <td style={{ padding: '13px 16px', textAlign: 'center', color: '#6B7280', fontSize: 13 }}>{fmt(loan.borrowed_at)}</td>
                      <td style={{ padding: '13px 16px', textAlign: 'center', fontSize: 13 }}>
                        {loan.due_date ? (
                          <span style={{ color: isLate ? '#DC2626' : '#6B7280', fontWeight: isLate ? 700 : 400 }}>
                            {isLate && '⚠️ '}{fmt(loan.due_date)}
                          </span>
                        ) : <span style={{ color: '#CBD5E1' }}>—</span>}
                      </td>
                      <td style={{ padding: '13px 16px', textAlign: 'center', fontSize: 13 }}>
                        {loan.returned_at
                          ? <span style={{ color: '#059669', fontWeight: 600 }}>{fmt(loan.returned_at)}</span>
                          : <span style={{ color: '#CBD5E1' }}>—</span>}
                      </td>
                      <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                        <Badge status={loan._status} />
                      </td>
                      <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          {!isDone && (
                            <ActionBtn label="Kembalikan" bg="#ECFDF5" color="#059669" border="#A7F3D0"
                              onClick={() => setReturnTarget(loan)} />
                          )}
                          <ActionBtn label="Hapus" bg="#FEF2F2" color="#DC2626" border="#FECACA"
                            onClick={() => setDeleteTarget(loan)} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="loans-mobile">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
              <p style={{ color: '#374151', fontWeight: 600, fontSize: 15 }}>
                {activeFilters > 0 ? 'Tidak ada catatan yang cocok' : 'Belum ada peminjaman'}
              </p>
            </div>
          ) : (
            filtered.map(loan => (
              <LoanCard
                key={loan.loan_id}
                loan={loan}
                onReturn={setReturnTarget}
                onDelete={setDeleteTarget}
              />
            ))
          )}
        </div>

      </div>

      <LoanModal isOpen={loanModal} onClose={() => setLoanModal(false)} onSubmit={handleAdd} allItems={allItems} />
      <ReturnModal loan={returnTarget} onClose={() => setReturnTarget(null)} onConfirm={handleReturn} />
      <DeleteModal loan={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  )
}

function ActionBtn({ label, bg, color, border, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: bg, color, border: `1.5px solid ${border}`,
      borderRadius: 8, padding: '5px 12px', fontSize: 12,
      fontWeight: 700, cursor: 'pointer',
      fontFamily: "'Plus Jakarta Sans',sans-serif",
      whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

const s = {
  primaryBtn: {
    background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
    color: '#fff', border: 'none', borderRadius: 10,
    padding: '10px 20px', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif",
    boxShadow: '0 4px 12px #2563EB44', whiteSpace: 'nowrap',
  },
  filterInput: {
    padding: '8px 12px', borderRadius: 9,
    border: '1.5px solid #CBD5E1', fontSize: 13,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    background: '#FAFAFA', color: '#1E3A8A',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '9px 12px', borderRadius: 10,
    border: '1.5px solid #CBD5E1', fontSize: 14,
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    background: '#FAFAFA', color: '#1E3A8A', outline: 'none',
  },
  inputErr: { borderColor: '#DC2626' },
  errText: { fontSize: 12, color: '#DC2626', margin: '4px 0 0' },
  overlay: {
    position: 'fixed', inset: 0, background: '#00000055',
    backdropFilter: 'blur(3px)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, animation: 'fadeIn .2s',
  },
  modal: {
    background: '#fff', borderRadius: 18, width: '100%',
    maxWidth: 520, boxShadow: '0 24px 60px #0004',
    animation: 'slideUp .25s', overflow: 'hidden',
  },
  mHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px 16px', borderBottom: '1.5px solid #F3F4F6',
  },
  mTitle: { fontSize: 17, fontWeight: 800, color: '#1E3A8A', margin: 0 },
  closeBtn: { background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#9CA3AF', padding: 4 },
  mBody: { padding: '20px 24px 8px', maxHeight: '65vh', overflowY: 'auto' },
  mFoot: {
    display: 'flex', justifyContent: 'flex-end', gap: 10,
    padding: '16px 24px 20px', borderTop: '1.5px solid #F3F4F6',
  },
  cancelBtn: {
    padding: '9px 18px', borderRadius: 10,
    border: '1.5px solid #CBD5E1', background: '#fff',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans',sans-serif", color: '#374151',
  },
}