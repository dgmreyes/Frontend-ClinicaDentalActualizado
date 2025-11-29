'use client';

import { Cita } from '@/types';

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);

interface ScheduleProps {
  citas: Cita[];
  onAdd: (date: string, hour: number) => void; 
  onEdit: (cita: Cita) => void;                
}
export default function Schedule({citas, onAdd, onEdit }: ScheduleProps) {
  
  const getDisplayDays = () => {
    const days = [];
    let current = new Date();
    current.setDate(current.getDate() - 1);
    if (current.getDay() === 0) current.setDate(current.getDate() - 1);
    while (days.length < 5) {
      if (current.getDay() !== 0) days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };
  const displayDays = getDisplayDays();
  const todayString = new Date().toISOString().split('T')[0];

  const formatDate = (date: Date) => {
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
    const dayNumber = date.getDate();
    return `${dayName} ${dayNumber}`;
  };

  const isSameDate = (date1: Date, dateString: string) => {
    const year = date1.getFullYear();
    const month = String(date1.getMonth() + 1).padStart(2, '0');
    const day = String(date1.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}` === dateString;
  };
  

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
      
      <div className="overflow-x-auto pb-2">
    
        <div className="min-w-[800px] grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] divide-x border-b">
            
            {/* Header: HORA */}
            <div className="bg-gray-50 p-2 text-xs text-center text-gray-400 font-bold flex items-center justify-center sticky left-0 z-10">
                HORA
            </div>

            {/* Header: DÍAS */}
            {displayDays.map((day, index) => {
                const dateStr = day.toISOString().split('T')[0]; 
                const isSameDayLocal = isSameDate(day, new Date().toISOString().split('T')[0]); 
                

                const isToday = isSameDate(day, new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2,'0') + '-' + String(new Date().getDate()).padStart(2,'0'));

                return (
                    <div 
                        key={index} 
                        className={`p-3 text-center capitalize ${
                            isToday ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600'
                        }`}
                    >
                        <span className="block text-sm font-bold">{formatDate(day)}</span>
                        <span className="text-xs font-light opacity-80">
                            {index === 0 ? '(Pasado)' : ''}
                            {isToday ? '(Hoy)' : ''}
                        </span>
                    </div>
                );
            })}
        </div>

        {/* BODY */}
        <div className="min-w-[800px] divide-y">
            {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] divide-x min-h-[100px]"> {/* min-h-[100px] da más altura a la celda */}
                
                {/* Columna Hora */}
                <div className="text-xs text-gray-500 font-medium p-2 text-center bg-gray-50 flex items-center justify-center border-r sticky left-0 z-10">
                    {hour}:00
                </div>

                {/* Columnas Días */}
                {displayDays.map((day, dayIndex) => {
                    const citaEncontrada = citas.find((c) => {
                        const horaCita = parseInt(c.Hora.split(':')[0]); 
                        return isSameDate(day, c.Fecha) && horaCita === hour;
                    });
                    
                    const isToday = isSameDate(day, new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2,'0') + '-' + String(new Date().getDate()).padStart(2,'0'));

                    return (
                        <div 
                            key={dayIndex} 
                            
                            className={`relative p-1 transition-colors hover:bg-gray-50 
                                ${isToday ? 'bg-blue-50/30' : ''} 
                                ${dayIndex === 0 ? 'bg-gray-100/50' : ''}
                            `}
                        >
                        {citaEncontrada ? (
                            
                            <div
                            onClick={() => onEdit(citaEncontrada)} 
                            className={`
                                w-full h-full rounded p-2 text-xs border cursor-pointer shadow-sm
                                flex flex-col justify-between 
                                ${citaEncontrada.Estado === 'Confirmada' ? 'bg-green-100 border-green-200 text-green-800' : ''}
                                ${citaEncontrada.Estado === 'Pendiente' ? 'bg-blue-100 border-blue-200 text-blue-800' : ''}
                                ${citaEncontrada.Estado === 'Cancelada' ? 'bg-red-100 border-red-200 text-red-800' : ''}
                            `}>
                                <div>
                                    <span className="font-bold block mb-1 line-clamp-2 leading-tight">
                                        {citaEncontrada.Motivo_Consulta}
                                    </span>
                                    <span className="opacity-80 block text-[10px]">
                                        {citaEncontrada.Hora.slice(0,5)} hrs
                                    </span>
                                </div>
                                <div className="mt-1 text-[9px] uppercase font-bold tracking-wide opacity-70 bg-white/50 rounded px-1 self-start">
                                    {citaEncontrada.Estado}
                                </div>
                            </div>
                            
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 group">
                                {dayIndex !== 0 && (
                                    <button 
                                        onClick={() => onAdd(
                                        day.toISOString().split('T')[0], // Pasamos la fecha de la columna
                                        hour                             // Pasamos la hora de la fila
                            )}
                                        className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm">
                                        +
                                    </button>
                                )}
                            </div>
                        )}
                        </div>
                    );
                })}
            </div>
            ))}
        </div>
      </div>
      
      <div className="md:hidden text-center text-xs text-gray-400 p-2 italic bg-gray-50 border-t">
        ← Desliza para ver más días →
      </div>
    </div>
  );
}