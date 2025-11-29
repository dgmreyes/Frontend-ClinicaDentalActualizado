'use client';

import { useEffect, useState } from 'react';
import { getMyAppointments, createCita, updateCita } from '@/actions/api';

import AppointmentList from '@/ui/dashboard/Tabla-Historial';
import AppointmentModal from '@/ui/dashboard/citas-ventana';
import { Cita } from '@/types';

export default function HistorialPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);


  const [tempDate, setTempDate] = useState('');
  const [tempHour, setTempHour] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setCitas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleCreateNew = () => {
    setEditingCita(null);
    setTempDate('');
    setTempHour('');
    setIsModalOpen(true);
  };

  const handleEdit = (cita: Cita) => {
    setEditingCita(cita);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: any, isEdit: boolean) => {
    if (isEdit && editingCita) {
      const idToUse = editingCita.documentId || editingCita.id; 
      await updateCita(String(idToUse), formData);
    } else {
      await createCita(formData);
    }
    await fetchData(); 
  };

  if (loading && citas.length === 0) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Historial Completo</h1>
        <button 
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow"
        >
          + Nueva Cita
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        

        <section>
            <AppointmentList 
              citas={citas} 
              onEdit={handleEdit} 
            />
        </section>

      </div>

      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingCita}
        initialDate={tempDate}
        initialTime={tempHour}
      />
    </div>
  );
}