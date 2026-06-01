import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'


const IconPlus     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
const IconEdit     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303z"/></svg>
const IconTrash    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
const IconFolder   = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25A2.25 2.25 0 0 0 4.5 16.5h15a2.25 2.25 0 0 0 2.25-2.25V9A2.25 2.25 0 0 0 19.5 6.75h-6.75a1.5 1.5 0 0 1-1.06-.44z"/></svg>
const IconClose    = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
const IconSearch   = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/></svg>
const IconEmpty    = () => <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25A2.25 2.25 0 0 0 4.5 16.5h15a2.25 2.25 0 0 0 2.25-2.25V9A2.25 2.25 0 0 0 19.5 6.75h-6.75a1.5 1.5 0 0 1-1.06-.44z"/></svg>


const PALETTE = [
  { bg: '#EFF6FF', border: '#BFDBFE', icon: '#2563EB', badge: '#DBEAFE', badgeText: '#1D4ED8' },
  { bg: '#F0FDF4', border: '#BBF7D0', icon: '#16A34A', badge: '#DCFCE7', badgeText: '#15803D' },
  { bg: '#FFF7ED', border: '#FED7AA', icon: '#EA580C', badge: '#FFEDD5', badgeText: '#C2410C' },
  { bg: '#FDF4FF', border: '#E9D5FF', icon: '#9333EA', badge: '#F3E8FF', badgeText: '#7E22CE' },
  { bg: '#FFF1F2', border: '#FECDD3', icon: '#E11D48', badge: '#FFE4E6', badgeText: '#BE123C' },
  { bg: '#F0FDFA', border: '#99F6E4', icon: '#0D9488', badge: '#CCFBF1', badgeText: '#0F766E' },
]


function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100" />
        <div className="w-14 h-5 rounded-full bg-gray-100" />
      </div>
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 flex-1 rounded-lg bg-gray-100" />
        <div className="h-8 flex-1 rounded-lg bg-gray-100" />
      </div>
    </div>
  )
}


function CategoryCard({ cat, palette, index, onEdit, onDelete }) {
  const p = palette[index % palette.length]
  const itemCount = cat.items_count ?? cat.item_count ?? cat.items?.length ?? 0

  return (
    <div
      className="rounded-2xl border shadow-sm p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: p.bg, borderColor: p.border }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: p.badge }}>
          <span style={{ color: p.icon }}><IconFolder /></span>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: p.badge, color: p.badgeText }}>
          {itemCount} item
        </span>
      </div>

      {/* Name & desc */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1">{cat.name}</h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {cat.description || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <button
          onClick={() => onEdit(cat)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all duration-150"
          style={{ background: p.badge, color: p.badgeText }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <IconEdit /> Edit
        </button>
        <button
          onClick={() => onDelete(cat.category_id, cat.name)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-150"
        >
          <IconTrash /> Hapus
        </button>
      </div>
    </div>
  )
}

// ── Modal Form
function CategoryModal({ open, onClose, onSubmit, form, setForm, editId, loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        style={{ animation: 'modalIn .2s ease' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800 text-base">
              {editId ? 'Edit Kategori' : 'Tambah Kategori'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {editId ? 'Ubah informasi kategori' : 'Buat kategori baru untuk barang'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <IconClose />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Nama Kategori <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Elektronik, Furnitur..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ '--tw-ring-color': '#2563EB33' }}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Deskripsi <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              placeholder="Deskripsi singkat tentang kategori ini..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none transition-all"
              style={{ '--tw-ring-color': '#2563EB33' }}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 disabled:opacity-60"
              style={{ background: loading ? '#93C5FD' : 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Menyimpan...
                </span>
              ) : editId ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)  translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Delete Confirm Modal
function DeleteModal({ open, name, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        style={{ animation: 'modalIn .2s ease' }}>
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 text-base mb-1">Hapus Kategori?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Kategori <span className="font-semibold text-gray-700">"{name}"</span> akan dihapus permanen. Aksi ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60">
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════
export default function Categories() {
  const [categories, setCategories] = useState([])
  const [filtered,   setFiltered]   = useState([])
  const [search,     setSearch]     = useState('')
  const [form,       setForm]       = useState({ name: '', description: '' })
  const [editId,     setEditId]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [delLoading, setDelLoading] = useState(false)
  const [skelLoading,setSkelLoading]= useState(true)
  const [modalOpen,  setModalOpen]  = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, name }

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
      setFiltered(res.data)
    } catch (_) {}
    setSkelLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  // Search filter
  useEffect(() => {
    if (!search.trim()) { setFiltered(categories); return }
    const q = search.toLowerCase()
    setFiltered(categories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    ))
  }, [search, categories])

  const openAdd = () => {
    setEditId(null)
    setForm({ name: '', description: '' })
    setModalOpen(true)
  }

  const openEdit = (cat) => {
    setEditId(cat.category_id)
    setForm({ name: cat.name, description: cat.description || '' })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditId(null)
    setForm({ name: '', description: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form)
      } else {
        await api.post('/categories', form)
      }
      closeModal()
      fetchCategories()
    } catch (_) {}
    setLoading(false)
  }

  const askDelete = (id, name) => setDeleteTarget({ id, name })

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDelLoading(true)
    try {
      await api.delete(`/categories/${deleteTarget.id}`)
      fetchCategories()
    } catch (_) {}
    setDelLoading(false)
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen" style={{ background: '#F0F4FF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Modals */}
      <CategoryModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editId={editId}
        loading={loading}
      />
      <DeleteModal
        open={!!deleteTarget}
        name={deleteTarget?.name}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={delLoading}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Kategori</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Kelola kategori barang inventaris Anda
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}
          >
            <IconPlus /> Tambah Kategori
          </button>
        </div>

        {/* ── Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Kategori', value: categories.length, color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Total Item',     value: categories.reduce((s, c) => s + (c.items_count ?? c.item_count ?? c.items?.length ?? 0), 0), color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Hasil Pencarian', value: filtered.length, color: '#EA580C', bg: '#FFF7ED' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-4 border shadow-sm flex items-center gap-3"
              style={{ background: s.bg, borderColor: s.bg }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-lg"
                style={{ background: '#fff', color: s.color, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                {s.value}
              </div>
              <span className="text-sm font-semibold text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <IconSearch />
          </span>
          <input
            type="text"
            placeholder="Cari kategori berdasarkan nama atau deskripsi..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 shadow-sm transition-all"
            style={{ '--tw-ring-color': '#2563EB33' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <IconClose />
            </button>
          )}
        </div>

        {/* ── Grid */}
        {skelLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-gray-300 mb-4"><IconEmpty /></div>
            <p className="text-base font-bold text-gray-500">
              {search ? 'Kategori tidak ditemukan' : 'Belum ada kategori'}
            </p>
            <p className="text-sm text-gray-400 mt-1 mb-5">
              {search
                ? `Tidak ada hasil untuk "${search}"`
                : 'Mulai dengan menambahkan kategori pertama Anda'}
            </p>
            {!search && (
              <button onClick={openAdd}
                className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all"
                style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
                <IconPlus /> Tambah Kategori
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cat, i) => (
              <CategoryCard
                key={cat.category_id}
                cat={cat}
                palette={PALETTE}
                index={i}
                onEdit={openEdit}
                onDelete={askDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}