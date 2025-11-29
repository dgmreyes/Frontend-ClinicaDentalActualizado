'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/actions/auth'; 

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    

    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const router = useRouter();


    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLocked && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {

            setIsLocked(false);
        }
        return () => clearInterval(timer);
    }, [isLocked, timeLeft]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked) return; 

        setError('');

        try {
            await login(email, password);

            setFailedAttempts(0);
            router.push('/dashboard'); 
        } catch (err: any) {

            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);


            if (newAttempts % 3 === 0) {
                const multiplier = newAttempts / 3;
                const lockDuration = multiplier * 30;
                
                setIsLocked(true);
                setTimeLeft(lockDuration);
                setError(`Demasiados intentos. Bloqueado por ${lockDuration} segundos.`);
            } else {
                setError('Credenciales incorrectas. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Iniciar Sesión</h2>
                
                {error && (
                    <div className={`p-3 mb-4 text-sm rounded ${isLocked ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-700'}`}>
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="email">Correo electrónico o usuario</label>
                        <input
                            type="text"
                            id="email"
                            className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLocked}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLocked}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLocked}
                        className={`w-full py-2 rounded-lg transition-colors duration-200 
                            ${isLocked 
                                ? 'bg-gray-400 cursor-not-allowed text-gray-100' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {isLocked ? `Espera ${timeLeft}s` : 'Ingresar'}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <Link href="/signin" className={`text-blue-600 hover:underline ${isLocked ? 'pointer-events-none text-gray-400' : ''}`}>
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}