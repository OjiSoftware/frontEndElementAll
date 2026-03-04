
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginError } from '../../types/errors';
import { emailValidator, validateLoginPassword } from '../../../helpers/validations';

export default function LoginPage() {
    const navigate = useNavigate();

    // Estados
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<LoginError>({});
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página se recargue
        setErrors({});

        const validationErrors: LoginError = {};


        //!TRAER Y USAR LOS HELPERS ACA
        if (!email) {
            validationErrors.email = 'El email es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = 'El formato del email no es válido.';
        }

        if (!password) {
            validationErrors.password1 = 'La contraseña es obligatoria.';
        }


        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (res.ok) {
                navigate('/management/products');
            } else {
                setErrors({ api: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.' });
            }
        } catch (error) {
            setErrors({ api: 'Error de conexión. Intenta más tarde.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="ELEMENTALL"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Campo Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${errors.email ? 'outline-red-500 focus:outline-red-500' : 'outline-white/10 focus:outline-indigo-500'
                                    }`}
                            />
                            {/* Mensaje de error de email */}
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="/recover-password" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${errors.password1 ? 'outline-red-500 focus:outline-red-500' : 'outline-white/10 focus:outline-indigo-500'
                                    }`}
                            />
                            {/* Mensaje de error de contraseña */}
                            {errors.password1 && (
                                <p className="mt-1 text-sm text-red-500">{errors.password1}</p>
                            )}
                        </div>
                    </div>

                    {/* Mensaje de error de la API */}
                    {errors.api && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm font-medium text-red-800 text-center">{errors.api}</p>
                        </div>
                    )}

                    {/* Botón Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Cargando...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-400">
                    Not a member?{' '}
                    <a href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
                        Start a 14 day free trial
                    </a>
                </p>
            </div>
        </div>
    );
}
