'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';

type Project = {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  image?: string;
  status?: string;
  category?: string;
  beneficiaries?: number;
  is_featured?: boolean;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  location?: string;
};

function toBool(v: any) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true';
  return Boolean(v);
}

export default function AdminProjectsCRUD() {
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selected, setSelected] = useState<Project | null>(null);

  const defaultForm = useMemo(
    () => ({
      title: '',
      description: '',
      start_date: new Date().toISOString().slice(0, 10),
      status: 'Próximamente',
      beneficiaries: 1,
      category: 'social',
      short_description: '',
      is_featured: false,
      // is_active is forced by backend
      file: null as File | null,
    }),
    []
  );

  const [form, setForm] = useState(defaultForm);

  const { data, isLoading, isError, error } = useQuery(
    ['adminProjects'],
    async () => {
      const res = await adminApi.getAllProjects();
      return res.data?.projects ?? res.data?.project ?? res.data ?? [];
    },
    {
      staleTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const projects: Project[] = (data as any) || [];

  async function refreshProjects() {
    // invalidación simple para mantener consistencia
    await queryClient.invalidateQueries(['adminProjects']);
  }

  function openCreate() {
    setSelected(null);
    setForm(defaultForm);
    setIsCreateOpen(true);
  }

  function openEdit(p: Project) {
    setSelected(p);
    setForm({
      ...defaultForm,
      title: p.title ?? '',
      description: p.description ?? '',
      start_date: (p.start_date ? p.start_date.slice(0, 10) : defaultForm.start_date) as any,
      status: p.status ?? 'Próximamente',
      beneficiaries: Number(p.beneficiaries ?? 1),
      category: p.category ?? 'social',
      short_description: (p.short_description ?? '').toString(),
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
    const desc = (form.description ?? '').trim();
    if (desc.length < 10) {
      toast.error('La descripción debe tener mínimo 10 caracteres');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', desc);
      fd.append('start_date', form.start_date);
      fd.append('status', form.status);
      fd.append('beneficiaries', String(form.beneficiaries));
      fd.append('category', form.category);
      fd.append('short_description', form.short_description || '');
      fd.append('is_featured', form.is_featured ? 'true' : 'false');

      // backend adminCreateProject solo valida estos campos; NO enviar is_active ni image
      await adminApi.createProject(fd as any);
      toast.success('Proyecto creado');
      setIsCreateOpen(false);
      await refreshProjects();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error creando proyecto');
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
      fd.append('start_date', form.start_date);
      fd.append('status', form.status);
      fd.append('beneficiaries', String(form.beneficiaries));
      fd.append('category', form.category);
      fd.append('short_description', form.short_description || '');
      fd.append('is_featured', form.is_featured ? 'true' : 'false');

      // Backend adminUpdateProject no valida is_active; image se maneja solo si hay archivo
      if (form.file) fd.append('image', form.file);

      await adminApi.updateProject(String(selected.id), fd as any);
      toast.success('Proyecto actualizado');
      setIsEditOpen(false);
      await refreshProjects();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error actualizando proyecto');
    }
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      await adminApi.deleteProject(String(selected.id));
      toast.success('Proyecto eliminado');
      setIsDeleteOpen(false);
      await refreshProjects();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error eliminando proyecto');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Admin Proyectos</h3>
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold"
          onClick={openCreate}
        >
          Nuevo Proyecto
        </button>
      </div>

      {isLoading && <div>Cargando proyectos...</div>}
      {isError && <div className="text-red-500">Error cargando: {String((error as any)?.message ?? error)}</div>}

      {!isLoading && !isError && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Título</th>
                  <th className="px-6 py-4 text-left font-bold">Estado</th>
                  <th className="px-6 py-4 text-left font-bold">Categoría</th>
                  <th className="px-6 py-4 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/50 border-b border-gray-100">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{p.title}</div>
                      {p.short_description ? (
                        <div className="text-sm text-gray-600 line-clamp-2">{p.short_description}</div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">{p.status ?? '-'}</td>
                    <td className="px-6 py-4">{p.category ?? '-'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold"
                        onClick={() => openEdit(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold"
                        onClick={() => {
                          setSelected(p);
                          setIsDeleteOpen(true);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Sin proyectos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="p-5 border-b flex items-center justify-between">
              <h4 className="text-xl font-bold">{isCreateOpen ? 'Crear proyecto' : 'Editar proyecto'}</h4>
              <button className="px-3 py-1 border rounded" onClick={closeAll}>Cerrar</button>
            </div>

            <div className="p-5 space-y-3">
              <label className="block">
                <span className="text-sm font-semibold">Título</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.title}
                  onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Descripción</span>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold">Fecha inicio</span>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((s) => ({ ...s, start_date: e.target.value }))}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold">Estado</span>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={form.status}
                    onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as any }))}
                  >
                    <option value="Próximamente">Próximamente</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Completado">Completado</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold">Beneficiarios</span>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="number"
                    min={1}
                    value={form.beneficiaries}
                    onChange={(e) => setForm((s) => ({ ...s, beneficiaries: Number(e.target.value) }))}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold">Categoría</span>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.category}
                    onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold">Descripción corta</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.short_description}
                  onChange={(e) => setForm((s) => ({ ...s, short_description: e.target.value }))}
                />
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((s) => ({ ...s, is_featured: e.target.checked }))}
                />
                <span className="text-sm font-semibold">Destacado</span>
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Imagen (opcional)</span>
                <input
                  className="w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((s) => ({ ...s, file: e.target.files?.[0] ?? null }))}
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 border rounded" onClick={closeAll}>
                  Cancelar
                </button>
                {isCreateOpen ? (
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold"
                    onClick={handleCreate}
                    disabled={!form.title || !form.description}
                  >
                    Crear
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold"
                    onClick={handleUpdate}
                    disabled={!form.title || !form.description || !selected}
                  >
                    Guardar
                  </button>
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
              <h4 className="text-xl font-bold">Eliminar proyecto</h4>
              <div className="text-sm text-gray-600 mt-1">
                Se hará un soft delete (is_active = false).
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="font-semibold">{selected.title}</div>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 border rounded" onClick={closeAll}>
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded font-semibold"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

