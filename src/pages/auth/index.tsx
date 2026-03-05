import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { LoginError } from "../../types/errors.types";
import { validateEmail } from "../../helpers/email.validator";
import { validatePassword } from "../../helpers/password.validator";
import logo from "../../assets/logo_elementAll.png";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Estados
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<LoginError>({});
    const [loading, setLoading] = useState(false);
    // Estado para el mensaje dinámico
    const [loginStatus, setLoginStatus] = useState("Iniciar Sesión");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const emailErr = validateEmail(email);
        const passErr = validatePassword(password);

        if (emailErr.email || passErr.password1) {
            setErrors({ ...emailErr, ...passErr });
            return;
        }

        setLoading(true);
        setLoginStatus("Verificando credenciales...");

        // Helper para el delay artificial
        const wait = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        try {
            // Ejecutamos el fetch y el delay en paralelo
            const [res] = await Promise.all([
                fetch("http://localhost:3000/api/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email, password }),
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }),
                wait(1000), // Un segundo para que se aprecien los mensajes
            ]);

            const data = await res.json();

            if (res.ok) {
                setLoginStatus("Iniciando sistema...");
                await wait(400); // Respiro final para la transición

                login(data.user);
                navigate("/management/products");
            } else {
                setErrors({
                    api:
                        data.error ||
                        data.message ||
                        "Credenciales incorrectas.",
                });
                setLoginStatus("Iniciar Sesión");
            }
        } catch (error) {
            setErrors({ api: "Error de conexión con el servidor." });
            setLoginStatus("Iniciar Sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-6 py-12 lg:px-8">
            {/* Logo y Encabezado */}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                <img
                    src={logo}
                    alt="ElementAll"
                    className="h-16 w-auto block mx-auto mb-6 object-contain"
                />
                <p className="mt-2 text-sm text-slate-400">
                    Bienvenido, ingresa tus credenciales
                </p>
            </div>

            {/* Card del Formulario */}
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <form
                    onSubmit={handleLogin}
                    className="bg-slate-800/80 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md space-y-6"
                >
                    {/* Mensaje de error de la API */}
                    {errors.api && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-3">
                            <p className="text-sm font-medium text-red-400 text-center">
                                {errors.api}
                            </p>
                        </div>
                    )}

                    {/* Campo Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2"
                        >
                            Email
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail
                                    className={`h-4 w-4 transition-colors ${errors.email ? "text-red-400" : "text-slate-500 group-focus-within:text-indigo-400"}`}
                                />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-2.5 text-sm text-white outline-none transition-all
                                    ${
                                        errors.email
                                            ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                                            : "border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-400 font-medium">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Campo Contraseña */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider"
                            >
                                Contraseña
                            </label>
                            <a
                                href="/auth/recover"
                                className="text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock
                                    className={`h-4 w-4 transition-colors ${errors.password1 ? "text-red-400" : "text-slate-500 group-focus-within:text-indigo-400"}`}
                                />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-2.5 text-sm text-white outline-none transition-all
                                    ${
                                        errors.password1
                                            ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                                            : "border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    }`}
                            />
                        </div>
                        {errors.password1 && (
                            <p className="mt-1.5 text-xs text-red-400 font-medium">
                                {errors.password1}
                            </p>
                        )}
                    </div>

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 text-white text-sm font-bold transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="ml-2">{loginStatus}</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="h-4 w-4" />
                                <span>Iniciar Sesión</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer del login */}
                <p className="mt-8 text-center text-sm text-slate-500">
                    ¿No tienes acceso?{" "}
                    <a
                        href="mailto:soporte@elementall.com"
                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                        Contacta a soporte
                    </a>
                </p>
            </div>
        </div>
    );
}
