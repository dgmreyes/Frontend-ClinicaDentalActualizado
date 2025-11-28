import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const validate = () => {
		const newErrors = {};
		// Validación de email
		if (!email) {
			newErrors.email = "El correo es obligatorio";
		} else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			newErrors.email = "Correo electrónico inválido";
		}
		// Validación de contraseña
		if (!password) {
			newErrors.password = "La contraseña es obligatoria";
		} else if (password.length < 6) {
			newErrors.password = "La contraseña debe tener al menos 6 caracteres";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	 const handleSubmit = (e) => {
		 e.preventDefault();
		 if (!validate()) return;
		 // Aquí iría la lógica de autenticación
		 // alert(`Login: ${email}`);
		 navigate("/");
	 };

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
				<h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Iniciar Sesión</h2>
				<form className="space-y-5" onSubmit={handleSubmit}>
					<div>
						<label className="block text-gray-700 mb-2" htmlFor="email">Correo electrónico</label>
						<input
							type="email"
							id="email"
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-500' : ''}`}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">{errors.email}</p>
						)}
					</div>
					<div>
						<label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
						<input
							type="password"
							id="password"
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? 'border-red-500' : ''}`}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">{errors.password}</p>
						)}
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Ingresar
					</button>
				</form>
				<p className="mt-6 text-center text-gray-600">
					¿No tienes cuenta?{' '}
					<Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;