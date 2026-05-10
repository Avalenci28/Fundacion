'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';

type Event = {
  id: number;
  title: string;
  description: string;
  image?: string;
  type?: string;
  date?: string;
  end_date?: string;
  location?: string;
  capacity?: number;
  status?: string;
  is_featured?: boolean;
  is_active?: boolean;
  category?: string;
};

function toBool(v: any) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true';
  return Boolean(v);
}

export default function AdminEventsCRUD() {
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selected, setSelected] = useState<Event | null>(null);

  const defaultForm = useMemo(
    () => ({
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      type: 'social',
      capacity: 100,
      location: '',
      category: 'social',
      is_featured: false,
      file: null as File | null,
    }),
    []
  );

  const [form, setForm] = useState(defaultForm);

  const { data, isLoading, isError, error } = useQuery(
    ['adminEvents'],
    async () => {
      const res = await adminApi.getAllEvents();
      if (!res.data) return [];
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.events)) return res.data.events;
      if (Array.isArray(res.data?.event)) return res.data.event;
      return [];
    },
    { staleTime: 0, refetchOnWindowFocus: false }
  );

  const events: Event[] = Array.isArray(data) ? data : [];

  async function refreshEvents() {
    await queryClient.invalidateQueries(['adminEvents']);
    await queryClient.invalidateQueries('publicStats');
  }

  function openCreate() {
    setSelected(null);
    setForm(defaultForm);
    setIsCreateOpen(true);
  }

  function openEdit(e: Event) {
    setSelected(e);
    setForm({
      title: e.title ?? '',
      description: e.description ?? '',
      date: (e.date ? e.date.slice(0, 10) : defaultForm.date) as any,
      type: e.type ?? 'social',
      capacity: Number(e.capacity ?? 100),
      location: e.location ?? '',
      category: e.category ?? 'social',
      is_featured: toBool(e.is_featured),
      file: null,
    });
    setIsEditOpen(true);
  }

  function closeAll() {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelected(null);
  }

  async function handleCreate() {
    const desc = (form.description ?? '').trim();
    if (desc.length < 10) {
      toast.error('La descripción debe tener mínimo 10 caracteres');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', desc);
      fd.append('date', form.date);
      fd.append('type', form.type);
      fd.append('capacity', String(form.capacity));
      fd.append('location', form.location);
      fd.append('category', form.category);
      fd.append('is_featured', form.is_featured ? 'true' : 'false');

      await adminApi.createEvent(fd as any);
      toast.success('Evento creado');
      setIsCreateOpen(false);
      await refreshEvents();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error creando evento');
    }
  }

  async function handleUpdate() {
    if (!selected) return;
    const desc = (form.description ?? '').trim();
    if (desc.length < 10) {
      toast.error('La descripción debe tener mínimo 10 caracteres');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', desc);
      fd.append('date', form.date);
      fd.append('type', form.type);
      fd.append('capacity', String(form.capacity));
      fd.append('location', form.location);
      fd.append('category', form.category);
      fd.append('is_featured', form.is_featured ? 'true' : 'false');

      if (form.file) fd.append('image', form.file);

      await adminApi.updateEvent(String(selected.id), fd as any);
      toast.success('Evento actualizado');
      setIsEditOpen(false);
      await refreshEvents();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error actualizando evento');
    }
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      await adminApi.deleteEvent(String(selected.id));
      toast.success('Evento eliminado');
      setIsDeleteOpen(false);
      await refreshEvents();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error eliminando evento');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Admin Eventos</h3>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold" onClick={openCreate}>
          Nuevo Evento
        </button>
      </div>

      {isLoading && <div>Cargando eventos...</div>}
      {isError && <div className="text-red-500">Error cargando: {String((error as any)?.message ?? error)}</div>}

      {!isLoading && !isError && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Título</th>
                  <th className="px-6 py-4 text-left font-bold">Fecha</th>
                  <th className="px-6 py-4 text-left font-bold">Ubicación</th>
                  <th className="px-6 py-4 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-blue-50/50 border-b border-gray-100">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{e.title}</div>
                      <div className="text-sm text-gray-500">{e.type ?? '-'}</div>
                    </td>
                    <td className="px-6 py-4">{e.date ? new Date(e.date).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">{e.location ?? '-'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold" onClick={() => openEdit(e)}>
                        Editar
                      </button>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold" onClick={() => { setSelected(e); setIsDeleteOpen(true); }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Sin eventos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="p-5 border-b flex items-center justify-between">
              <h4 className="text-xl font-bold">{isCreateOpen ? 'Crear evento' : 'Editar evento'}</h4>
              <button className="px-3 py-1 border rounded" onClick={closeAll}>Cerrar</button>
            </div>
            <div className="p-5 space-y-3">
              <label className="block">
                <span className="text-sm font-semibold">Título</span>
                <input className="w-full border rounded px-3 py-2" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Descripción</span>
                <textarea className="w-full border rounded px-3 py-2" rows={4} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold">Fecha</span>
                  <input className="w-full border rounded px-3 py-2" type="date" value={form.date} onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Tipo</span>
                  <input className="w-full border rounded px-3 py-2" value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold">Capacidad</span>
                  <input className="w-full border rounded px-3 py-2" type="number" min={1} value={form.capacity} onChange={(e) => setForm((s) => ({ ...s, capacity: Number(e.target.value) }))} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Ubicación</span>
                  <input className="w-full border rounded px-3 py-2" value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-semibold">Categoría</span>
                <input className="w-full border rounded px-3 py-2" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((s) => ({ ...s, is_featured: e.target.checked }))} />
                <span className="text-sm font-semibold">Destacado</span>
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Imagen (opcional)</span>
                <input className="w-full" type="file" accept="image/*" onChange={(e) => setForm((s) => ({ ...s, file: e.target.files?.[0] ?? null }))} />
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 border rounded" onClick={closeAll}>Cancelar</button>
                {isCreateOpen ? (
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold" onClick={handleCreate} disabled={!form.title || !form.description}>Crear</button>
                ) : (
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold" onClick={handleUpdate} disabled={!form.title || !form.description || !selected}>Guardar</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b">
              <h4 className="text-xl font-bold">Eliminar evento</h4>
              <div className="text-sm text-gray-600 mt-1">Soft delete (is_active = false)</div>
            </div>
            <div className="p-5 space-y-4">
              <div className="font-semibold">{selected.title}</div>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 border rounded" onClick={closeAll}>Cancelar</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded font-semibold" onClick={handleDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
