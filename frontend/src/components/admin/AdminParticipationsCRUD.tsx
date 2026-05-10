'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';
import { Check, X, Eye, Trash2, Users } from 'lucide-react';

type Participation = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  availability?: string;
  motivation?: string;
  status: string;
  created_at?: string;
};

export default function AdminParticipationsCRUD() {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Participation | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery(
    ['adminParticipations'],
    async () => {
      const res = await adminApi.getAllParticipations();
      if (!res.data) return [];
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.participations)) return res.data.participations;
      return [];
    },
    { staleTime: 0, refetchOnWindowFocus: false }
  );

  const participations: Participation[] = Array.isArray(data) ? data : [];

  async function refreshParticipations() {
    await queryClient.invalidateQueries(['adminParticipations']);
    await queryClient.invalidateQueries('publicStats');
  }

  async function handleApprove(id: number) {
    try {
      await adminApi.approveParticipation(String(id));
      toast.success('Participación aprobada');
      await refreshParticipations();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error aprobando participación');
    }
  }

  async function handleReject(id: number) {
    try {
      await adminApi.rejectParticipation(String(id));
      toast.success('Participación rechazada');
      await refreshParticipations();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error rechazando participación');
    }
  }

  async function handleDelete(id: number) {
    try {
      await adminApi.deleteParticipation(String(id));
      toast.success('Solicitud eliminada');
      await refreshParticipations();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Error eliminando solicitud');
    }
  }

  function viewParticipation(p: Participation) {
    setSelected(p);
    setIsViewOpen(true);
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            <X className="w-3 h-3" /> Pendiente
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <Check className="w-3 h-3" /> Aprobado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <X className="w-3 h-3" /> Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            {status}
          </span>
        );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Solicitudes de Participación</h3>
        <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold">
          {participations.filter(p => p.status === 'pending').length} pendientes
        </span>
      </div>

      {isLoading && <div>Cargando solicitudes...</div>}
      {isError && <div className="text-red-500">Error cargando: {String((error as any)?.message ?? error)}</div>}

      {!isLoading && !isError && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Nombre</th>
                  <th className="px-6 py-4 text-left font-bold">Email</th>
                  <th className="px-6 py-4 text-left font-bold">Teléfono</th>
                  <th className="px-6 py-4 text-left font-bold">Estado</th>
                  <th className="px-6 py-4 text-left font-bold">Fecha</th>
                  <th className="px-6 py-4 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {participations.map((p) => (
                  <tr key={p.id} className={`hover:bg-blue-50/50 border-b border-gray-100 ${p.status === 'pending' ? 'bg-yellow-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{p.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${p.email}`} className="text-blue-600 hover:underline">{p.email}</a>
                    </td>
                    <td className="px-6 py-4">{p.phone ?? '-'}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold"
                        onClick={() => viewParticipation(p)}
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      {p.status === 'pending' && (
                        <>
                          <button
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl font-bold"
                            onClick={() => handleApprove(p.id)}
                          >
                            <Check className="w-4 h-4" />
                            Aprobar
                          </button>
                          <button
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold"
                            onClick={() => handleReject(p.id)}
                          >
                            <X className="w-4 h-4" />
                            Rechazar
                          </button>
                        </>
                      )}
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {participations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Sin solicitudes de participación</td>
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
              <h4 className="text-xl font-bold">Ver Solicitud</h4>
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
                <div>
                  <label className="text-sm font-semibold text-gray-500">Estado</label>
                  <div className="mt-1">{getStatusBadge(selected.status)}</div>
                </div>
              </div>
              {selected.skills && (
                <div>
                  <label className="text-sm font-semibold text-gray-500">Habilidades</label>
                  <div className="p-3 bg-gray-50 rounded-xl mt-1">{selected.skills}</div>
                </div>
              )}
              {selected.availability && (
                <div>
                  <label className="text-sm font-semibold text-gray-500">Disponibilidad</label>
                  <div className="p-3 bg-gray-50 rounded-xl mt-1">{selected.availability}</div>
                </div>
              )}
              {selected.motivation && (
                <div>
                  <label className="text-sm font-semibold text-gray-500">Motivación</label>
                  <div className="p-3 bg-gray-50 rounded-xl mt-1">{selected.motivation}</div>
                </div>
              )}
              <div className="text-xs text-gray-400">
                Enviado: {selected.created_at ? new Date(selected.created_at).toLocaleString() : '-'}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 border rounded" onClick={() => setIsViewOpen(false)}>Cerrar</button>
                {selected.status === 'pending' && (
                  <>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
                      onClick={() => {
                        handleApprove(selected.id);
                        setIsViewOpen(false);
                      }}
                    >
                      Aprobar
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700"
                      onClick={() => {
                        handleReject(selected.id);
                        setIsViewOpen(false);
                      }}
                    >
                      Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
