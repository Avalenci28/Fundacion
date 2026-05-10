'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';

type Post = {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: string;
  slug?: string;
  category?: string;
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
};

function toBool(v: any) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true';
  return Boolean(v);
}

export default function AdminPostsCRUD() {
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selected, setSelected] = useState<Post | null>(null);

  const defaultForm = useMemo(
    () => ({
      title: '',
      content: '',
      excerpt: '',
      category: 'blog',
      is_featured: false,
      file: null as File | null,
    }),
    []
  );

  const [form, setForm] = useState(defaultForm);

  const { data, isLoading, isError, error } = useQuery(
    ['adminPosts'],
    async () => {
      const res = await adminApi.getAllPosts();
      // Handle various response structures
      if (!res.data) return [];
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.posts)) return res.data.posts;
      if (Array.isArray(res.data?.post)) return res.data.post;
      return [];
    },
    { staleTime: 0, refetchOnWindowFocus: false }
  );

  const posts: Post[] = Array.isArray(data) ? data : [];

  async function refreshPosts() {
    await queryClient.invalidateQueries(['adminPosts']);
    await queryClient.invalidateQueries('publicStats');
  }

  function openCreate() {
    setSelected(null);
    setForm(defaultForm);
    setIsCreateOpen(true);
  }

  function openEdit(p: Post) {
    setSelected(p);
    setForm({
      title: p.title ?? '',
      content: p.content ?? '',
      excerpt: p.excerpt ?? '',
      category: p.category ?? 'blog',
      is_featured: toBool(p.is_featured),
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
    const title = (form.title ?? '').trim();
    const content = (form.content ?? '').trim();
    if (title.length < 3) {
      toast.error('El título debe tener mínimo 3 caracteres');
      return;
    }
    if (content.length < 10) {
      toast.error('El contenido debe tener mínimo 10 caracteres');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('content', content);
      fd.append('excerpt', form.excerpt);
      fd.append('category', form.category);
      fd.append('is_featured', form.is_featured ? 'true' : 'false');
      fd.append('is_published', 'true');

      await adminApi.createPost(fd as any);
      toast.success('Post creado');
      setIsCreateOpen(false);
      await refreshPosts();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error creando post');
    }
  }

  async function handleUpdate() {
    if (!selected) return;
    const title = (form.title ?? '').trim();
    const content = (form.content ?? '').trim();
    if (title.length < 3) {
      toast.error('El título debe tener mínimo 3 caracteres');
      return;
    }
    if (content.length < 10) {
      toast.error('El contenido debe tener mínimo 10 caracteres');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('content', content);
      fd.append('excerpt', form.excerpt);
      fd.append('category', form.category);
      fd.append('is_featured', form.is_featured ? 'true' : 'false');
      fd.append('is_published', 'true');

      if (form.file) fd.append('image', form.file);

      await adminApi.updatePost(String(selected.id), fd as any);
      toast.success('Post actualizado');
      setIsEditOpen(false);
      await refreshPosts();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error actualizando post');
    }
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      await adminApi.deletePost(String(selected.id));
      toast.success('Post eliminado');
      setIsDeleteOpen(false);
      await refreshPosts();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error eliminando post');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Admin Posts</h3>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold" onClick={openCreate}>
          Nuevo Post
        </button>
      </div>

      {isLoading && <div>Cargando posts...</div>}
      {isError && <div className="text-red-500">Error cargando: {String((error as any)?.message ?? error)}</div>}

      {!isLoading && !isError && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Título</th>
                  <th className="px-6 py-4 text-left font-bold">Categoría</th>
                  <th className="px-6 py-4 text-left font-bold">Fecha</th>
                  <th className="px-6 py-4 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/50 border-b border-gray-100">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-sm text-gray-500">{p.author ?? '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold">
                        {p.category ?? 'blog'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold" onClick={() => openEdit(p)}>
                        Editar
                      </button>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold" onClick={() => { setSelected(p); setIsDeleteOpen(true); }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Sin posts</td>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h4 className="text-xl font-bold">{isCreateOpen ? 'Crear post' : 'Editar post'}</h4>
              <button className="px-3 py-1 border rounded" onClick={closeAll}>Cerrar</button>
            </div>
            <div className="p-5 space-y-3">
              <label className="block">
                <span className="text-sm font-semibold">Título</span>
                <input className="w-full border rounded px-3 py-2" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Contenido</span>
                <textarea className="w-full border rounded px-3 py-2" rows={6} value={form.content} onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Extracto (opcional)</span>
                <input className="w-full border rounded px-3 py-2" value={form.excerpt} onChange={(e) => setForm((s) => ({ ...s, excerpt: e.target.value }))} />
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
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold" onClick={handleCreate} disabled={!form.title || !form.content}>Crear</button>
                ) : (
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold" onClick={handleUpdate} disabled={!form.title || !form.content || !selected}>Guardar</button>
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
              <h4 className="text-xl font-bold">Eliminar post</h4>
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
