'use client';

import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function NotaModal({ isOpen, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  
  // Inicializamos con hora actual
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    Fecha: new Date().toISOString().split('T')[0],
    Hora: currentTime,
    Descripcion: '',
    Tratamiento: '',
    Seguimiento: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
      // Resetear formulario
      setFormData({
        Fecha: new Date().toISOString().split('T')[0],
        Hora: currentTime,
        Descripcion: '',
        Tratamiento: '',
        Seguimiento: '',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-blue-800">Nueva Nota de Evolución</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
              <input 
                type="date"
                required
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Fecha}
                onChange={e => setFormData({...formData, Fecha: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
              <input 
                type="time"
                required
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Hora}
                onChange={e => setFormData({...formData, Hora: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Hallazgos *</label>
            <textarea 
              rows={3}
              required
              placeholder="Detalle de la evolución..."
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.Descripcion}
              onChange={e => setFormData({...formData, Descripcion: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento Realizado *</label>
            <textarea 
              rows={2}
              required
              placeholder="Procedimientos realizados hoy..."
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.Tratamiento}
              onChange={e => setFormData({...formData, Tratamiento: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seguimiento / Próx. Pasos *</label>
            <textarea 
              rows={2}
              required
              placeholder="Indicaciones para el paciente o próxima cita..."
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.Seguimiento}
              onChange={e => setFormData({...formData, Seguimiento: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded text-gray-700 font-medium">Cancelar</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar Nota'}
            </button>
          </div>
        </form>
      </div>
      </div>
  );
}