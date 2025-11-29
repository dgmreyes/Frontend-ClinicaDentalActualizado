'use client';

import { useEffect, useState } from 'react';
import { getMyAppointments, getPacientes } from '@/actions/api';
import { getUser } from '@/actions/auth';
import { Cita } from '@/types';
import Link from 'next/link';
import { 
  UsersIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import StatCard from '@/ui/dashboard/stat-card';
import { MonthlyChart, StatusChart } from '@/ui/dashboard/dashboar-charts';
import Schedule from '@/ui/dashboard/schedule'; 

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Datos
  const [citas, setCitas] = useState<Cita[]>([]);
  const [totalPacientes, setTotalPacientes] = useState(0);
  
  // Estadísticas calculadas
  const [stats, setStats] = useState({
    citasHoy: 0,
    pendientes: 0,
    chartMes: [] as any[],
    chartEstado: [] as any[],
  });

  useEffect(() => {
    const userData = getUser();
    setUser(userData);

    const fetchData = async () => {
      try {
        const dataCitas = await getMyAppointments();
        setCitas(dataCitas);

        const role = userData?.role?.name;
        if (role === 'Dentista' || role === 'Asistente') {
            const dataPacientes = await getPacientes(''); // Sin filtro para traer todos
            setTotalPacientes(dataPacientes.length);
            
            const hoyStr = new Date().toISOString().split('T')[0];
            

            const hoyCount = dataCitas.filter((c: Cita) => c.Fecha === hoyStr).length;

            const pendCount = dataCitas.filter((c: Cita) => c.Estado === 'Pendiente').length;


            const estadosCount = [
                { name: 'Pendiente', value: pendCount },
                { name: 'Confirmada', value: dataCitas.filter((c: Cita) => c.Estado === 'Confirmada').length },
                { name: 'Cancelada', value: dataCitas.filter((c: Cita) => c.Estado === 'Cancelada').length },
                { name: 'Completada', value: dataCitas.filter((c: Cita) => c.Estado === 'Completada').length },
            ].filter(item => item.value > 0);

            const currentMonth = new Date().getMonth();
            const mesesData = [
                { name: 'Mes Pasado', citas: dataCitas.filter((c: Cita) => new Date(c.Fecha).getMonth() === currentMonth - 1).length },
                { name: 'Este Mes', citas: dataCitas.filter((c: Cita) => new Date(c.Fecha).getMonth() === currentMonth).length },
                { name: 'Próx. Mes', citas: dataCitas.filter((c: Cita) => new Date(c.Fecha).getMonth() === currentMonth + 1).length },
            ];

            setStats({
                citasHoy: hoyCount,
                pendientes: pendCount,
                chartMes: mesesData,
                chartEstado: estadosCount
            });
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Cargando dashboard...</div>;

  const roleName = user?.role?.name;
  const isStaff = roleName === 'Dentista' || roleName === 'Asistente';


  if (!isStaff) {
    const nextCita = citas.find(c => c.Estado === 'Confirmada' || c.Estado === 'Pendiente');
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-4xl mx-auto">
            {/* Banner Bienvenida */}
            <div className="bg-linear-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white mb-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-2">¡Hola, {user?.username}! 👋</h1>
                <p className="opacity-90">Bienvenido a tu portal de salud dental. Aquí puedes ver tus próximas visitas.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Tarjeta Próxima Cita */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CalendarDaysIcon className="w-6 h-6 text-blue-600"/>
                        Tu Próxima Cita
                    </h2>
                    {nextCita ? (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="text-3xl font-bold text-blue-700 mb-1">
                                {new Date(nextCita.Fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                            </div>
                            <div className="text-blue-600 font-medium mb-4 flex items-center gap-2">
                                <ClockIcon className="w-5 h-5" />
                                {nextCita.Hora.slice(0,5)} hrs
                            </div>
                            <div className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                                <span className="font-bold block text-gray-800">Motivo:</span> 
                                {nextCita.Motivo_Consulta}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No tienes citas programadas pronto.
                        </div>
                    )}
                    <div className="mt-6">
                        <Link href="/dashboard/citas" className="block w-full text-center py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                            {nextCita ? 'Ver Detalles' : 'Agendar Cita'}
                        </Link>
                    </div>
                </div>

                {/* Accesos Rápidos Paciente */}
                <div className="space-y-4">
                     <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center gap-4">
                        <div className="bg-white p-3 rounded-full text-green-600">
                            <CheckCircleIcon className="w-8 h-8"/>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-700">{citas.length}</div>
                            <div className="text-green-800 text-sm">Visitas Totales</div>
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-2">¿Necesitas ayuda?</h3>
                        <p className="text-sm text-gray-500 mb-4">Contacta a nuestro soporte o llama a recepción.</p>
                        <div className="font-bold text-lg text-gray-700"> 2222-5555</div>
                     </div>
                </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header con Bienvenida */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Panel de Control
                </h1>
                <p className="text-gray-500">
                    Bienvenido, <span className="font-semibold text-blue-600">{roleName} {user?.username}</span>
                </p>
            </div>
            <div className="text-right hidden md:block">
                <div className="text-sm text-gray-400">Fecha de hoy</div>
                <div className="font-bold text-gray-700">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="Pacientes Totales" 
                value={totalPacientes} 
                icon={<UsersIcon className="w-6 h-6" />} 
                color="blue"
            />
            <StatCard 
                title="Citas Hoy" 
                value={stats.citasHoy} 
                icon={<CalendarDaysIcon className="w-6 h-6" />} 
                color="green"
                description="Pacientes agendados"
            />
            <StatCard 
                title="Pendientes" 
                value={stats.pendientes} 
                icon={<ClockIcon className="w-6 h-6" />} 
                color="orange"
                description="Por confirmar"
            />
            <StatCard 
                title="Ingresos (Est)" 
                value={`$${citas.length * 50}`} // Cálculo simulado
                icon={<span className="text-xl font-bold">$</span>} 
                color="purple"
                description="Proyección base"
            />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyChart data={stats.chartMes} />
            <StatusChart data={stats.chartEstado} />
        </div>


        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Agenda Semanal Rápida</h2>
            <Schedule citas={citas} 
                onAdd={() => {}} 
                onEdit={() => {}} />
        </div>

      </div>
       </div>
  );
}