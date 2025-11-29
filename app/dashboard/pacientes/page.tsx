'use client';

import PacienteModal from '@/ui/dashboard/paciente-Modal';
import { savePaciente, getPacientes } from '@/actions/api';
import { Paciente } from '@/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCircleIcon, MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Paciente | null>(null);

  const refresh = async () => {
    const data = await getPacientes(searchTerm);
    setPacientes(data);
  };
  const handleSave = async (data: any, docId?: string) => {
    await savePaciente(data, docId);
    await refresh();
  };

  const handleEdit = (e: React.MouseEvent, p: any) => {
    e.preventDefault(); // Evita navegar al detalle
    e.stopPropagation();
    setEditingPatient(p);
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getPacientes(searchTerm);
        setPacientes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Directorio de Pacientes</h1>
          <button 
            onClick={handleNew} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
          >
            + Nuevo Paciente
          </button>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-4 top-3.5" />
        </div>

        {/* LISTA DE PACIENTES */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Cargando directorio...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientes.length > 0 ? (
              // CAMBIO AQUÍ: Usamos 'p' para que coincida con tu lógica
              pacientes.map((p) => (
                <div key={p.documentId} className="relative group block">
                  {/* ENVOLTORIO PRINCIPAL: Link al detalle */}
                  <Link 
                    href={`/dashboard/pacientes/${p.documentId}`} 
                    className="block bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 transition">
                        <UserCircleIcon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition">
                          {p.nombre} {p.apellido}
                        </h3>
                        <p className="text-sm text-gray-500">Tel: {p.telefono}</p>
                      </div>
                    </div>
                  </Link>

                  {/* BOTÓN EDITAR: Posicionado absolutamente sobre la tarjeta */}
                  <button 
                    onClick={(e) => handleEdit(e, p)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition z-10"
                    title="Editar datos personales"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                No se encontraron pacientes.
              </div>
            )}
          </div>
        )}

        {/* MODAL */}
        <PacienteModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
          initialData={editingPatient}
        />
      </div>
    </div>
  );
}