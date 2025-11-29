'use client';

import { useState, useEffect } from 'react';
import { Cita } from '@/types';
import { getPacientes, getDentistas } from '@/actions/api'; 
import { getUser } from '@/actions/auth';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, isEdit: boolean) => Promise<void>;
  initialData?: Cita | null;      
  initialDate?: string;          
  initialTime?: string;          
}

export default function AppointmentModal({ 
  isOpen, onClose, onSave, initialData, initialDate, initialTime 
}: ModalProps) {
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [pacientesList, setPacientesList] = useState<any[]>([]);
  const [dentistasList, setDentistasList] = useState<any[]>([]);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isStaff, setIsStaff] = useState(false);

  // El estado guardará el ID numérico (aunque en inputs HTML se maneja como string temporalmente)
  const [formData, setFormData] = useState({
    Fecha: '',
    Hora: '',
    Motivo_Consulta: '',
    Estado: 'Pendiente', 
    paciente: '', 
    dentista: '', 
  });

  useEffect(() => {
    if (!isOpen) return;
    
    setErrorMessage('');

    const user = getUser();
    setCurrentUser(user);
    
    const roleName = user?.role?.name;
    const isStaffUser = roleName === 'Dentista' || roleName === 'Asistente';
    setIsStaff(isStaffUser);

    const loadLists = async () => {
      try {
        const [dents, pats] = await Promise.all([
          getDentistas(), 
          isStaffUser ? getPacientes('') : Promise.resolve([]) 
        ]);
        setDentistasList(dents);
        setPacientesList(pats);
      } catch (error) {
        console.error("Error cargando listas", error);
      }
    };
    loadLists();

    if (initialData) {
      // MODO EDICIÓN
      setFormData({
        Fecha: initialData.Fecha,
        Hora: initialData.Hora.slice(0, 5), 
        Motivo_Consulta: initialData.Motivo_Consulta,
        Estado: initialData.Estado || 'Pendiente',
        // CAMBIO: Usamos .id en lugar de .documentId
        paciente: initialData.paciente?.id ? String(initialData.paciente.id) : '', 
        dentista: initialData.dentista?.id ? String(initialData.dentista.id) : '',
      });
    } else {
      // MODO CREACIÓN
      let myPatientId = '';
      
      if (!isStaffUser) {
          if (user?.paciente) {
             // CAMBIO: Priorizamos el ID numérico
             myPatientId = user.paciente.id || '';
          } 
      }

      setFormData({
        Fecha: initialDate || '',
        Hora: initialTime ? (parseInt(initialTime, 10) < 10 ? `0${parseInt(initialTime, 10)}:00` : `${initialTime}:00`) : '',
        Motivo_Consulta: '',
        Estado: 'Pendiente',
        paciente: myPatientId ? String(myPatientId) : '',
        // CAMBIO: Usamos .id para el dentista logueado
        dentista: roleName === 'Dentista' && user?.dentista ? String(user.dentista.id) : '',
      });
    }
  }, [initialData, initialDate, initialTime, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (isStaff && !formData.paciente) {
         throw new Error("Debes seleccionar un paciente");
      }
      
      if (!formData.dentista) throw new Error("Debes seleccionar un dentista");

      const dataToSend: any = {
        Fecha: formData.Fecha,
        Hora: formData.Hora + ':00.000',
        Motivo_Consulta: formData.Motivo_Consulta,
        Estado: initialData ? formData.Estado : 'Pendiente', 
      };

      if (formData.paciente) {
        dataToSend.paciente = Number(formData.paciente);
      }
      if (formData.dentista) {
        dataToSend.dentista = Number(formData.dentista);
      }
      
      await onSave(dataToSend, !!initialData);
      onClose();
    } catch (error: any) {
      console.error(error);
      const msg = error.message || '';
      if (msg.includes('cita activa') || msg.includes('active appointment')) {
        setErrorMessage('No puedes agendar: Ya tienes una cita activa. Por favor completa o cancela la anterior.');
      } else {
        setErrorMessage(msg || 'Ocurrió un error al guardar la cita.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">
            {initialData ? 'Editar Cita' : 'Nueva Cita'}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado de la Cita</label>
              <select
                className={`w-full border rounded-lg p-2 focus:ring-2 outline-none font-medium
                  ${formData.Estado === 'Confirmada' ? 'border-green-300 bg-green-50 text-green-800 focus:ring-green-500' : ''}
                  ${formData.Estado === 'Pendiente' ? 'border-yellow-300 bg-yellow-50 text-yellow-800 focus:ring-yellow-500' : ''}
                  ${formData.Estado === 'Cancelada' ? 'border-red-300 bg-red-50 text-red-800 focus:ring-red-500' : ''}
                  ${formData.Estado === 'Completada' ? 'border-gray-300 bg-gray-100 text-gray-800 focus:ring-gray-500' : ''}
                `}
                value={formData.Estado}
                onChange={(e) => setFormData({ ...formData, Estado: e.target.value })}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada"> Confirmada</option>
                <option value="Completada"> Completada</option>
                <option value="Cancelada"> Cancelada</option>
              </select>
            </div>
          )}


          {isStaff ? (
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                <select 
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.paciente}
                    onChange={(e) => setFormData({...formData, paciente: e.target.value})}
                >
                    <option value="">-- Seleccionar Paciente --</option>
                    {pacientesList.map(p => (
                      <option key={p.documentId} value={p.id}>
                        {p.nombre} {p.apellido}
                      </option>
                    ))}
                </select>
             </div>
          ) : (
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente (Tú)</label>
                {formData.paciente ? (
                    <div className="w-full border border-green-200 bg-green-50 text-green-800 font-medium rounded-lg p-2 flex justify-between items-center">
                        <span>{currentUser?.username}</span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">Verificado</span>
                    </div>
                ) : (
                    <div className="w-full border border-blue-200 bg-blue-50 text-blue-700 text-sm rounded-lg p-3">
                        <strong>Hola, {currentUser?.username || 'Usuario'}.</strong>
                        <br/>
                        <span className="text-xs opacity-75">Tu cita se asignará automáticamente a tu expediente.</span>
                    </div>
                )}
             </div>
          )}


          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Dentista</label>
             <select 
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.dentista}
                onChange={(e) => setFormData({...formData, dentista: e.target.value})}
             >
                <option value="">-- Seleccionar Doctor --</option>
                {dentistasList.map(d => (
                  <option key={d.documentId} value={d.id}>
                    Dr. {d.nombre} {d.apellido} - {d.Especialidad}
                  </option>
                ))}
             </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input 
                type="date" 
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Fecha}
                onChange={(e) => setFormData({...formData, Fecha: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input 
                type="time" 
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Hora}
                onChange={(e) => setFormData({...formData, Hora: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Consulta</label>
            <textarea 
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Limpieza, Dolor de muela..."
              value={formData.Motivo_Consulta}
              onChange={(e) => setFormData({...formData, Motivo_Consulta: e.target.value})}
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm mb-2 animate-in slide-in-from-top-1">
              <p className="font-bold">No se pudo guardar</p>
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading} 
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cita'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}