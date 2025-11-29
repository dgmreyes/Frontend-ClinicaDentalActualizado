'use client';

import { Cita } from '@/types';
interface ListProps {
  citas: Cita[];
  onEdit: (cita: Cita) => void; // Nuevo prop
}
export default function AppointmentList({ citas, onEdit }: ListProps) {
  
  const sortedCitas = [...citas].sort((a, b) => {
    const dateA = new Date(`${a.Fecha}T${a.Hora}`);
    const dateB = new Date(`${b.Fecha}T${b.Hora}`);
    return dateB.getTime() - dateA.getTime(); 
  });

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Historial de Citas</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
            <tr>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Hora</th>
              <th className="px-6 py-3">Motivo</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
              
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedCitas.length > 0 ? (
              sortedCitas.map((cita) => (
                <tr key={cita.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {/* Formato de fecha legible */}
                    {new Date(cita.Fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {cita.Hora.slice(0, 5)} hrs
                  </td>
                  <td className="px-6 py-4">
                    {cita.Motivo_Consulta}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${cita.Estado === 'Confirmada' ? 'bg-green-100 text-green-800' : ''}
                      ${cita.Estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${cita.Estado === 'Cancelada' ? 'bg-red-100 text-red-800' : ''}
                      ${cita.Estado === 'Completada' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {cita.Estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
        <button 
          onClick={() => onEdit(cita)}
          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          Editar
        </button>
     </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay citas registradas en el historial.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}