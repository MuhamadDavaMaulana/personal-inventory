import { useEffect, useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const CONDITION_MAP = {
  good:    { label: 'Bagus',  bg: '#D1FAE5', color: '#065F46' },
  damaged: { label: 'Rusak',  bg: '#FEF3C7', color: '#92400E' },
  lost:    { label: 'Hilang', bg: '#FEE2E2', color: '#991B1B' },
}
const STATUS_MAP = {
  available: { label: 'Tersedia', bg: '#DBEAFE', color: '#1D4ED8' },
  borrowed:  { label: 'Dipinjam', bg: '#FFEDD5', color: '#C2410C' },
}

const EMPTY_FORM = {
  category_id: '', name: '', description: '',
  quantity: 1, condition: 'good', status: 'available',
}

function Badge({ map, value }) {
  const cfg = map[value] || { label: value, bg: '#F3F4F6', color: '#374151' }
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
      {[200, 100, 50, 70, 70, 90].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px', textAlign: i > 1 ? 'center' : 'left' }}>
          <div style={{
            height: 14, width: w, borderRadius: 6, margin: i > 1 ? '0 auto' : 0,
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

function ItemModal({ isOpen, onClose, onSubmit, initial, categories }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(initial ? {
      category_id: initial.category_id,
      name: initial.name,
      description: initial.description || '',
      quantity: initial.quantity,
      condition: initial.condition,
      status: initial.status,
    } : EMPTY_FORM)
    setErrors({})
  }, [initial, isOpen])

  if (!isOpen) return null

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama barang wajib diisi.'
    if (!form.category_id) e.category_id = 'Pilih kategori.'
    if (!form.quantity || form.quantity < 1) e.quantity = 'Jumlah minimal 1.'
    return e
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    await onSubmit(form)
    setSaving(false)
  }

  const F = ({ label, error, children }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={s.label}>{label}</label>
      {children}
      {error && <p style={s.errText}>{error}</p>}
    </div>
  )

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...s.modal, margin: '0 16px' }}>
        <div style={s.mHead}>
          <h2 style={s.mTitle}>{initial ? 'Edit Barang' : 'Tambah Barang'}</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.mBody}>
          <F label="Nama Barang *" error={errors.name}>
            <input style={{ ...s.input, ...(errors.name ? s.inputErr : {}) }}
              placeholder="Contoh: Laptop Dell XPS"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </F>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <F label="Kategori *" error={errors.category_id}>
              <select style={{ ...s.input, ...(errors.category_id ? s.inputErr : {}) }}
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}>
                <option value="">Pilih Kategori</option>
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>{c.name}</option>
                ))}
              </select>
            </F>
            <F label="Jumlah *" error={errors.quantity}>
              <input type="number" min={1} style={{ ...s.input, ...(errors.quantity ? s.inputErr : {}) }}
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: +e.target.value })} />
            </F>
            <F label="Kondisi">
              <select style={s.input} value={form.condition}
                onChange={e => setForm({ ...form, condition: e.target.value })}>
                <option value="good">Bagus</option>
                <option value="damaged">Rusak</option>
                <option value="lost">Hilang</option>
              </select>
            </F>
            <F label="Status">
              <select style={s.input} value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="available">Tersedia</option>
                <option value="borrowed">Dipinjam</option>
              </select>
            </F>
          </div>

          <F label="Deskripsi">
            <textarea style={{ ...s.input, height: 68, resize: 'none' }}
              placeholder="Deskripsi singkat (opsional)..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </F>
        </div>

        <div style={s.mFoot}>
          <button style={s.cancelBtn} onClick={onClose}>Batal</button>
          <button style={{ ...s.primaryBtn, opacity: saving ? 0.7 : 1 }}
            onClick={submit} disabled={saving}>
            {saving ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Tambah Barang'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteModal({ item, onClose, onConfirm }) {
  if (!item) return null
  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...s.modal, maxWidth: 400, margin: '0 16px' }}>
        <div style={s.mHead}>
          <h2 style={{ ...s.mTitle, color: '#DC2626' }}>Hapus Barang</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🗑️</div>
          <p style={{ color: '#374151', fontSize: 15 }}>
            Yakin hapus <strong>"{item.name}"</strong>?
          </p>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 6 }}>
            Data peminjaman terkait mungkin ikut terpengaruh.
          </p>
        </div>
        <div style={s.mFoot}>
          <button style={s.cancelBtn} onClick={onClose}>Batal</button>
          <button style={{ ...s.primaryBtn, background: '#DC2626', boxShadow: '0 4px 12px #DC262633' }}
            onClick={onConfirm}>
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Mobile Item Card ──────────────────────────────────────────────────────────
function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: 16,
      border: '1.5px solid #E5E7EB',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1, marginRight: 8 }}>
          <p style={{ fontWeight: 700, color: '#1E3A8A', margin: 0, fontSize: 14 }}>{item.name}</p>
          {item.description && (
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.description}
            </p>
          )}
        </div>
        <Badge map={STATUS_MAP} value={item.status} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', borderRadius: 6, padding: '2px 8px' }}>
          📁 {item.category?.name || '—'}
        </span>
        <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', borderRadius: 6, padding: '2px 8px' }}>
          Qty: {item.quantity}
        </span>
        <Badge map={CONDITION_MAP} value={item.condition} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onEdit(item)} style={{
          flex: 1, padding: '8px', borderRadius: 8,
          background: '#EFF6FF', color: '#2563EB',
          border: '1.5px solid #BFDBFE',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}>Edit</button>
        <button onClick={() => onDelete(item)} style={{
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

export default function Items() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [formModal, setFormModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterCond, setFilterCond] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [iRes, cRes] = await Promise.all([api.get('/items'), api.get('/categories')])
      setItems(iRes.data)
      setCategories(cRes.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const filtered = useMemo(() => {
    return items.filter(item => {
      const q = search.toLowerCase()
      if (q && !item.name.toLowerCase().includes(q) &&
          !(item.description || '').toLowerCase().includes(q)) return false
      if (filterCat && String(item.category_id) !== String(filterCat)) return false
      if (filterCond && item.condition !== filterCond) return false
      if (filterStatus && item.status !== filterStatus) return false
      return true
    })
  }, [items, search, filterCat, filterCond, filterStatus])

  const activeFilters = [search, filterCat, filterCond, filterStatus].filter(Boolean).length
  const clearFilters = () => { setSearch(''); setFilterCat(''); setFilterCond(''); setFilterStatus('') }

  const handleSubmit = async (form) => {
    try {
      if (editTarget) {
        await api.put(`/items/${editTarget.item_id}`, form)
      } else {
        await api.post('/items', form)
      }
      setFormModal(false); setEditTarget(null)
      fetchAll()
    } catch {}
  }

  const handleDelete = async () => {
    try { await api.delete(`/items/${deleteTarget.item_id}`) } catch {}
    setDeleteTarget(null)
    fetchAll()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; }
        tr.item-row:hover td { background: #EEF4FF !important; }

        .items-desktop { display: block; }
        .items-mobile  { display: none;  }
        .stats-grid    { grid-template-columns: repeat(4, 1fr); }
        .page-header   { flex-direction: row; align-items: flex-start; }
        .page-padding  { padding: 32px 24px; }

        @media (max-width: 768px) {
          .items-desktop { display: none !important; }
          .items-mobile  { display: flex !important; flex-direction: column; gap: 10px; }
          .stats-grid    { grid-template-columns: repeat(2, 1fr) !important; }
          .page-header   { flex-direction: column !important; gap: 12px; }
          .page-padding  { padding: 16px 12px !important; }
          .filter-bar    { flex-direction: column !important; }
        }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto' }} className="page-padding">

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }} className="page-header">
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1E3A8A', margin: 0 }}>📦 Barang</h1>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>Kelola seluruh barang inventaris</p>
          </div>
          <button style={s.primaryBtn}
            onClick={() => { setEditTarget(null); setFormModal(true) }}>
            + Tambah Barang
          </button>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gap: 12, marginBottom: 20 }} className="stats-grid">
          {[
            { label: 'Total Barang', value: items.length,                                          color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Tersedia',     value: items.filter(i => i.status === 'available').length,    color: '#059669', bg: '#ECFDF5' },
            { label: 'Dipinjam',     value: items.filter(i => i.status === 'borrowed').length,     color: '#D97706', bg: '#FFFBEB' },
            { label: 'Rusak/Hilang', value: items.filter(i => i.condition !== 'good').length,      color: '#DC2626', bg: '#FEF2F2' },
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
        }} className="filter-bar">
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
            <input style={{ ...s.filterInput, paddingLeft: 32 }}
              placeholder="Cari nama/deskripsi..."
              value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <select style={{ ...s.filterInput, flex: '1 1 140px', minWidth: 0 }}
            value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.category_id} value={c.category_id}>{c.name}</option>
            ))}
          </select>
          <select style={{ ...s.filterInput, flex: '1 1 120px', minWidth: 0 }}
            value={filterCond} onChange={e => setFilterCond(e.target.value)}>
            <option value="">Semua Kondisi</option>
            <option value="good">Bagus</option>
            <option value="damaged">Rusak</option>
            <option value="lost">Hilang</option>
          </select>
          <select style={{ ...s.filterInput, flex: '1 1 120px', minWidth: 0 }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="available">Tersedia</option>
            <option value="borrowed">Dipinjam</option>
          </select>
          {activeFilters > 0 && (
            <button style={{
              padding: '8px 14px', borderRadius: 8, border: '1.5px solid #FCA5A5',
              background: '#FEF2F2', color: '#DC2626', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif",
              whiteSpace: 'nowrap',
            }} onClick={clearFilters}>
              ✕ Reset ({activeFilters})
            </button>
          )}
        </div>

        {/* Result count */}
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
          Menampilkan <strong style={{ color: '#1E3A8A' }}>{filtered.length}</strong> dari {items.length} barang
        </p>

        {/* ── Desktop Table ── */}
        <div className="items-desktop" style={{
          background: '#fff', borderRadius: 16,
          boxShadow: '0 2px 16px #1E3A8A0D', overflow: 'hidden',
          border: '1.5px solid #E5E7EB',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
                {['Nama Barang', 'Kategori', 'Qty', 'Kondisi', 'Status', 'Aksi'].map((h, i) => (
                  <th key={h} style={{
                    padding: '14px 16px', color: '#fff', fontWeight: 700,
                    textAlign: i > 1 ? 'center' : 'left', fontSize: 13,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '52px', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                    <p style={{ color: '#374151', fontWeight: 600, fontSize: 15 }}>
                      {activeFilters > 0 ? 'Tidak ada barang yang cocok' : 'Belum ada barang'}
                    </p>
                    <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>
                      {activeFilters > 0 ? 'Coba ubah filter pencarian.' : 'Klik "+ Tambah Barang" untuk memulai.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.item_id} className="item-row" style={{
                    borderTop: i === 0 ? 'none' : '1px solid #F3F4F6',
                    transition: 'background .12s',
                  }}>
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontWeight: 700, color: '#1E3A8A', margin: 0 }}>{item.name}</p>
                      {item.description && (
                        <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 240 }}>
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px', color: '#6B7280' }}>{item.category?.name || '—'}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center', fontWeight: 700, color: '#374151' }}>{item.quantity}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}><Badge map={CONDITION_MAP} value={item.condition} /></td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}><Badge map={STATUS_MAP} value={item.status} /></td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <ActionBtn label="Edit" bg="#EFF6FF" color="#2563EB" border="#BFDBFE"
                          onClick={() => { setEditTarget(item); setFormModal(true) }} />
                        <ActionBtn label="Hapus" bg="#FEF2F2" color="#DC2626" border="#FECACA"
                          onClick={() => setDeleteTarget(item)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="items-mobile">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
              <p style={{ color: '#374151', fontWeight: 600, fontSize: 15 }}>
                {activeFilters > 0 ? 'Tidak ada barang yang cocok' : 'Belum ada barang'}
              </p>
            </div>
          ) : (
            filtered.map(item => (
              <ItemCard
                key={item.item_id}
                item={item}
                onEdit={i => { setEditTarget(i); setFormModal(true) }}
                onDelete={setDeleteTarget}
              />
            ))
          )}
        </div>

      </div>

      <ItemModal
        isOpen={formModal}
        onClose={() => { setFormModal(false); setEditTarget(null) }}
        onSubmit={handleSubmit}
        initial={editTarget}
        categories={categories}
      />
      <DeleteModal
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
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