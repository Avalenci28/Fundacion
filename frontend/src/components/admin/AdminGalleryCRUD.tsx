'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';

type GalleryItem = {
  id: number;
  title: string;
  description?: string;
  url?: string;
  image?: string;
  category?: string;
  type?: string;
  is_featured?: boolean;
  is_active?: boolean;
};

function toBool(v: any) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true';
  return Boolean(v);
}

export default function AdminGalleryCRUD() {
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const defaultForm = useMemo(
    () => ({
      title: '',
      description: '',
      category: 'otro',
      is_featured: false,
      file: null as File | null,
    }),
    []
  );

  const [form, setForm] = useState(defaultForm);

  const { data, isLoading, isError, error } = useQuery(
    ['adminGallery'],
    async () => {
      const res = await adminApi.getAllGallery();
      if (!res.data) return [];
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.gallery)) return res.data.gallery;
      if (Array.isArray(res.data?.item)) return res.data.item;
      return [];
    },
    { staleTime: 0, refetchOnWindowFocus: false }
  );

  const items: GalleryItem[] = Array.isArray(data) ? data : [];

  async function refreshGallery() {
    await queryClient.invalidateQueries(['adminGallery']);
    await queryClient.invalidateQueries('publicStats');
  }

  function openCreate() {
    setSelected(null);
    setForm(defaultForm);
    setIsCreateOpen(true);
  }

  function openEdit(item: GalleryItem) {
    setSelected(item);
    setForm({
      title: item.title ?? '',
      description: item.description ?? '',
      category: item.category ?? 'otro',
      is_featured: toBool(item.is_featured),
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
    if (!form.title.trim()) {
      toast.error('El título es requerido');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description || '');
      fd.append('category', form.category);
      fd.append('is_featured', form.is_featured ? 'true' : 'false');

      if (form.file) fd.append('image', form.file);

      await adminApi.createGalleryItem(fd as any);
      toast.success('Item de galería creado');
      setIsCreateOpen(false);
      await refreshGallery();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error creando item');
    }
  }

  async function handleUpdate() {
    if (!selected) return;

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description || '');
      fd.append('category', form.category);
      fd.append('is_featured', form.is_featured ? 'true' : 'false');

      if (form.file) fd.append('image', form.file);

      await adminApi.updateGalleryItem(String(selected.id), fd as any);
      toast.success('Item actualizado');
      setIsEditOpen(false);
      await refreshGallery();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error actualizando item');
    }
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      await adminApi.deleteGalleryItem(String(selected.id));
      toast.success('Item eliminado');
      setIsDeleteOpen(false);
      await refreshGallery();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error eliminando item');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Admin Galería</h3>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold" onClick={openCreate}>
          Nuevo Item
        </button>
      </div>

      {isLoading && <div>Cargando galería...</div>}
      {isError && <div className="text-red-500">Error cargando: {String((error as any)?.message ?? error)}</div>}

      {!isLoading && !isError && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Título</th>
                  <th className="px-6 py-4 text-left font-bold">Categoría</th>
                  <th className="px-6 py-4 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/50 border-b border-gray-100">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{item.title}</div>
                      {item.description && <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>}
                    </td>
                    <td className="px-6 py-4">{item.category ?? '-'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold" onClick={() => openEdit(item)}>
                        Editar
                      </button>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold" onClick={() => { setSelected(item); setIsDeleteOpen(true); }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Sin items en galería</td>
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
              <h4 className="text-xl font-bold">{isCreateOpen ? 'Crear item' : 'Editar item'}</h4>
              <button className="px-3 py-1 border rounded" onClick={closeAll}>Cerrar</button>
            </div>
            <div className="p-5 space-y-3">
              <label className="block">
                <span className="text-sm font-semibold">Título</span>
                <input className="w-full border rounded px-3 py-2" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Descripción</span>
                <textarea className="w-full border rounded px-3 py-2" rows={3} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
              </label>
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
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold" onClick={handleCreate} disabled={!form.title}>Crear</button>
                ) : (
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold" onClick={handleUpdate} disabled={!form.title || !selected}>Guardar</button>
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
              <h4 className="text-xl font-bold">Eliminar item</h4>
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
