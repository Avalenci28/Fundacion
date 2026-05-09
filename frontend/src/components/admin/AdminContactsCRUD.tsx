'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';
import { Check, X, Eye, Trash2 } from 'lucide-react';

type Contact = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read?: boolean;
  is_replied?: boolean;
  created_at?: string;
};

export default function AdminContactsCRUD() {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Contact | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery(
    ['adminContacts'],
    async () => {
      const res = await adminApi.getAllContacts();
      if (!res.data) return [];
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.contacts)) return res.data.contacts;
      return [];
    },
    { staleTime: 0, refetchOnWindowFocus: false }
  );

  const contacts: Contact[] = Array.isArray(data) ? data : [];

  async function refreshContacts() {
    await queryClient.invalidateQueries(['adminContacts']);
  }

  async function markAsRead(id: number) {
    try {
      await adminApi.markContactAsRead(String(id));
      toast.success('Mensaje marcado como leído');
      await refreshContacts();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error marcando como leído');
    }
  }

  async function handleDelete(id: number) {
    try {
      await adminApi.deleteContact(String(id));
      toast.success('Mensaje eliminado');
      await refreshContacts();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error eliminando mensaje');
    }
  }

  function viewContact(c: Contact) {
    setSelected(c);
    setIsViewOpen(true);
    if (!c.is_read) {
      markAsRead(c.id);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Admin Mensajes</h3>
        <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold">
          {contacts.filter(c => !c.is_read).length} no leídos
        </span>
      </div>

      {isLoading && <div>Cargando mensajes...</div>}
      {isError && <div className="text-red-500">Error cargando: {String((error as any)?.message ?? error)}</div>}

      {!isLoading && !isError && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Nombre</th>
                  <th className="px-6 py-4 text-left font-bold">Email</th>
                  <th className="px-6 py-4 text-left font-bold">Asunto</th>
                  <th className="px-6 py-4 text-left font-bold">Estado</th>
                  <th className="px-6 py-4 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {contacts.map((c) => (
                  <tr key={c.id} className={`hover:bg-blue-50/50 border-b border-gray-100 ${!c.is_read ? 'bg-yellow-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-sm text-gray-500">{c.phone ?? '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">{c.email}</a>
                    </td>
                    <td className="px-6 py-4">{c.subject ?? '-'}</td>
                    <td className="px-6 py-4">
                      {c.is_read ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          <Check className="w-3 h-3" /> Leído
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          Nuevo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold"
                        onClick={() => viewContact(c)}
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Sin mensajes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="p-5 border-b flex items-center justify-between">
              <h4 className="text-xl font-bold">Ver Mensaje</h4>
              <button className="px-3 py-1 border rounded" onClick={() => setIsViewOpen(false)}>Cerrar</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500">Nombre</label>
                  <div className="font-semibold text-lg">{selected.name}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">Email</label>
                  <div className="text-blue-600">{selected.email}</div>
                </div>
                {selected.phone && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Teléfono</label>
                    <div>{selected.phone}</div>
                  </div>
                )}
                {selected.subject && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Asunto</label>
                    <div>{selected.subject}</div>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Mensaje</label>
                <div className="p-4 bg-gray-50 rounded-xl mt-1">{selected.message}</div>
              </div>
              <div className="text-xs text-gray-400">
                Enviado: {selected.created_at ? new Date(selected.created_at).toLocaleString() : '-'}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 border rounded" onClick={() => setIsViewOpen(false)}>Cerrar</button>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? 'Mensaje de Fundación Malambo'}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
                >
                  Responder
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
