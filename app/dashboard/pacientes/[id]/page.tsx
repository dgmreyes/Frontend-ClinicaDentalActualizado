'use client';

import { useEffect, useState } from 'react';
import { getPacienteExpediente, createNotaClinica } from '@/actions/api';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  ClipboardDocumentListIcon, 
  FolderIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import { Paciente } from '@/types'; 
import NotaModal from '@/ui/dashboard/nota-Modal'; 

export default function ExpedientePage() {
  const { id } = useParams();
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);

  // --- CORRECCIÓN AQUÍ: Faltaba definir el estado del modal ---
  const [isNotaOpen, setIsNotaOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        try {
          const data = await getPacienteExpediente(String(id));
          setPaciente(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [id]);

  const handleSaveNota = async (data: any) => {
    if (paciente?.expediente?.documentId) {
      await createNotaClinica(data, paciente.expediente.documentId);
      // Recargar datos para ver la nota nueva al instante
      const updatedData = await getPacienteExpediente(String(id));
      setPaciente(updatedData);
    } else {
      alert("Error crítico: Este paciente no tiene expediente asociado.");
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando expediente...</div>;
  if (!paciente) return <div className="p-10 text-center">Paciente no encontrado.</div>;

  // Acceso directo al expediente (con validación segura)
  const expediente = paciente.expediente;

  // Colores según el estado del expediente
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-100 text-green-700 border-green-200';
      case 'Tratamiento': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Archivado': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO SUPERIOR */}
        <div className="flex justify-between items-center mb-6">
            {/* BOTÓN VOLVER */}
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-500 hover:text-blue-600 transition"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver al directorio
            </button>

            {/* BOTÓN AGREGAR NOTA (Ahora sí funciona porque existe setIsNotaOpen) */}
            <button 
                onClick={() => setIsNotaOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-blue-700 flex items-center gap-2"
            >
                <ClipboardDocumentListIcon className="w-4 h-4" />
                + Nueva Nota
            </button>
        </div>

        {/* --- TARJETA PRINCIPAL: DATOS DEL PACIENTE --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {paciente.nombre} {paciente.apellido}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                   {paciente.telefono}
                </span>
                <span className="flex items-center gap-1">
                   {paciente.Direccion || 'Sin dirección'}
                </span>
              </div>
            </div>

            {/* STATUS DEL EXPEDIENTE */}
            {expediente ? (
              <div className={`px-4 py-3 rounded-xl border ${getStatusColor(expediente.estado)}`}>
                <div className="text-xs uppercase font-bold tracking-wider opacity-70 mb-1">Estado Expediente</div>
                <div className="text-xl font-bold flex items-center gap-2">
                  <FolderIcon className="w-5 h-5" />
                  {expediente.estado}
                </div>
                <div className="text-xs mt-1 opacity-80">
                  Creado: {expediente.Fecha_Creacion}
                </div>
              </div>
            ) : (
              <div className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 text-sm">
                 Este paciente no tiene expediente creado.
              </div>
            )}
          </div>
        </div>

        {/* --- GRID DE CONTENIDO --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA (Grande): Notas Clínicas */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
              Evolución Clínica
            </h2>

            {expediente && expediente.resumen_clinicos && expediente.resumen_clinicos.length > 0 ? (
              <div className="space-y-4">
                {expediente.resumen_clinicos.map((nota: any) => (
                  <div key={nota.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        <span>{nota.Fecha || new Date().toLocaleDateString()}</span>
                      </div>
                      <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        Nota Clínica
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {nota.Descripcion || "Sin descripción detallada..."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-xl border border-gray-200 text-center text-gray-500">
                No hay notas clínicas registradas en este expediente.
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA (Pequeña): Citas Recientes */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              Historial de Citas
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {paciente.citas && paciente.citas.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {paciente.citas.slice(0, 5).map((cita: any) => (
                    <div key={cita.id} className="p-4 hover:bg-gray-50">
                      <div className="font-semibold text-gray-800 text-sm">
                        {cita.Fecha}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {cita.Motivo_Consulta}
                      </div>
                      <div className={`text-[10px] uppercase font-bold mt-2 inline-block px-2 py-0.5 rounded
                        ${cita.Estado === 'Completada' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}
                      `}>
                        {cita.Estado}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-gray-500 text-center">
                  Sin citas registradas.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL */}
        <NotaModal 
          isOpen={isNotaOpen}
          onClose={() => setIsNotaOpen(false)}
          onSave={handleSaveNota}
        />
      </div>
    </div>
  );
}