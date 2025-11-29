'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerPatient } from '@/actions/auth';

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        nombre: '',
        apellido: '',
        telefono: '',
        Direccion: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {

            if (formData.password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");
            
            await registerPatient(formData);
            

            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al registrarse. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-2 text-center text-blue-600">Crear Cuenta</h2>
                <p className="text-center text-gray-500 mb-8">Regístrate para gestionar tus citas médicas</p>
                
                {error && (
                    <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3">Datos de Acceso</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                    placeholder="ejemplo@correo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="username">Usuario</label>
                                    <input
                                        type="text"
                                        id="username"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                        placeholder="Tu nombre de usuario"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">Contraseña</label>
                                    <input
                                        type="password"
                                        id="password"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                        placeholder="******"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">Información del Paciente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Juan"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="apellido">Apellido</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Pérez"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="telefono">Teléfono</label>
                            <input
                                type="number"
                                id="telefono"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="88888888"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="Direccion">Dirección (Opcional)</label>
                            <input
                                type="text"
                                id="Direccion"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Ciudad, Barrio, Calle..."
                                value={formData.Direccion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 font-bold text-white rounded-lg transition-all duration-200 shadow-md
                            ${loading 
                                ? 'bg-blue-400 cursor-wait' 
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                            }`}
                    >
                        {loading ? 'Creando tu cuenta...' : 'Registrarse'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}