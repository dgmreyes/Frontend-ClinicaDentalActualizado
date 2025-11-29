'use client';

import { useState, useEffect } from 'react';
import { Paciente } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, documentId?: string) => Promise<void>;
  initialData?: Paciente | null;
}

export default function PacienteModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    Direccion: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        apellido: initialData.apellido,
        telefono: initialData.telefono.toString(),
        Direccion: initialData.Direccion || '',
      });
    } else {
      setFormData({ nombre: '', apellido: '', telefono: '', Direccion: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData, initialData?.documentId);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al guardar paciente');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">{initialData ? 'Editar Paciente' : 'Nuevo Paciente'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              placeholder="Nombre" 
              required
              className="border p-2 rounded w-full"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
            <input 
              placeholder="Apellido" 
              required
              className="border p-2 rounded w-full"
              value={formData.apellido}
              onChange={e => setFormData({...formData, apellido: e.target.value})}
            />
          </div>
          <input 
            placeholder="Teléfono" 
            type="number"
            required
            className="border p-2 rounded w-full"
            value={formData.telefono}
            onChange={e => setFormData({...formData, telefono: e.target.value})}
          />
          <textarea 
            placeholder="Dirección" 
            className="border p-2 rounded w-full"
            value={formData.Direccion}
            onChange={e => setFormData({...formData, Direccion: e.target.value})}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}