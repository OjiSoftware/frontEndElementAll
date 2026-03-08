import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { LoginError } from "@/types/errors.types";
import { validateEmail } from "../../helpers/email.validator";
import { validatePassword } from "../../helpers/password.validator";
import logo from "../../assets/logo_elementAll.png";

// Extendemos LoginError para sumar el campo del nombre
interface RegisterError extends LoginError {
    name?: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Estados independientes para cada ojito
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<RegisterError>({});
    const [loading, setLoading] = useState(false);
    const [registerStatus, setRegisterStatus] = useState("Crear cuenta");

    const handleInputChange = (
        field: keyof RegisterError,
        value: string,
        setter: (v: string) => void,
    ) => {
        setter(value);
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailRes = validateEmail(email);
        const passRes = validatePassword(password);

        // 1. Iniciamos el objeto de errores
        const freshErrors: RegisterError = {
            name: !name.trim() ? "El nombre es obligatorio." : undefined,
            email: emailRes.email || undefined,
            password1: passRes.password1 || undefined,
            api: undefined,
        };

        // 2. Aplicamos la misma lógica que usaste en ResetPasswordPage
        if (!confirmPassword) {
            freshErrors.password2 = "Por favor, repetí la contraseña.";
        } else if (password !== confirmPassword) {
            freshErrors.password2 = "Las contraseñas no coinciden.";
        }

        setErrors(freshErrors);

        if (Object.values(freshErrors).some((error) => error !== undefined)) {
            return;
        }

        setLoading(true);
        setRegisterStatus("Creando...");
        const wait = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        try {
            const [res] = await Promise.all([
                fetch("http://localhost:3000/api/auth/register", {
                    method: "POST",
                    body: JSON.stringify({ name, email, password }),
                    headers: { "Content-Type": "application/json" },
                }),
                wait(1000), // Mantenemos el mismo delay estético del login
            ]);

            const data = await res.json();

            if (res.ok) {
                setRegisterStatus("¡Éxito!");
                await wait(400);
                navigate("/auth/login?registered=true");
            } else {
                setErrors({
                    api:
                        data.error ||
                        data.message ||
                        "Error al crear la cuenta.",
                });
                setRegisterStatus("Crear cuenta");
            }
        } catch (error) {
            setErrors({ api: "Error de conexión." });
            setRegisterStatus("Crear cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4 py-4 font-sans">
            <div className="w-full max-w-md flex flex-col items-center">
                {/* Header Logo - Exactamente igual */}
                <div className="w-full text-center mb-10">
                    <img
                        src={logo}
                        alt="ElementAll"
                        className="h-14 sm:h-16 w-auto block mx-auto mb-4 object-contain"
                    />
                    <p className="text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">
                        Gestión Empresarial Integral
                    </p>
                </div>

                {/* Card Container */}
                <div className="w-full bg-gray-800/50 border border-white/10 p-6 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Crear cuenta
                        </h2>
                        <p className="text-gray-400 text-sm mt-2">
                            Completá tus datos para registrarte
                        </p>
                    </div>

                    <form
                        onSubmit={handleRegister}
                        className="space-y-5" // Un poco menos de espacio que el login para que entren los 4 inputs sin hacer la card gigante
                        noValidate
                    >
                        {errors.api && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-3 mb-6">
                                <p className="text-xs font-medium text-red-400 text-center">
                                    {errors.api}
                                </p>
                            </div>
                        )}

                        {/* Campo Nombre */}
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-200 ml-1"
                            >
                                Nombre completo
                            </label>
                            <div className="relative group flex items-center">
                                <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-20 translate-y-[1.5px]">
                                    <User
                                        className={`h-4 w-4 transition-colors ${errors.name ? "text-red-400" : "text-gray-500 group-focus-within:text-indigo-400"}`}
                                    />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "name",
                                            e.target.value,
                                            setName,
                                        )
                                    }
                                    placeholder="Juan Pérez"
                                    className={`block w-full h-11 bg-gray-900/50 border rounded-lg pl-10 pr-3 text-sm outline-none transition-all
                                        ${errors.name ? "border-red-500/50 focus:ring-1 focus:ring-red-500 text-red-400 placeholder:text-red-400/60" : "border-white/10 focus:border-indigo-500 text-white placeholder:text-gray-500"}`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-[10px] text-red-400 font-medium ml-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Campo Email */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-200 ml-1"
                            >
                                Correo electrónico
                            </label>
                            <div className="relative group flex items-center">
                                <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-20 translate-y-[1.5px]">
                                    <Mail
                                        className={`h-4 w-4 transition-colors ${errors.email ? "text-red-400" : "text-gray-500 group-focus-within:text-indigo-400"}`}
                                    />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "email",
                                            e.target.value,
                                            setEmail,
                                        )
                                    }
                                    placeholder="tu@correo.com"
                                    className={`block w-full h-11 bg-gray-900/50 border rounded-lg pl-10 pr-3 text-sm outline-none transition-all
                                        ${errors.email ? "border-red-500/50 focus:ring-1 focus:ring-red-500 text-red-400 placeholder:text-red-400/60" : "border-white/10 focus:border-indigo-500 text-white placeholder:text-gray-500"}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-[10px] text-red-400 font-medium ml-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Campo Contraseña 1 */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-200 ml-1"
                            >
                                Contraseña
                            </label>
                            <div className="relative group flex items-center">
                                <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-20 translate-y-[1px]">
                                    <Lock
                                        className={`h-4 w-4 transition-colors ${errors.password1 ? "text-red-400" : "text-gray-500 group-focus-within:text-indigo-400"}`}
                                    />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "password1",
                                            e.target.value,
                                            setPassword,
                                        )
                                    }
                                    placeholder="Mínimo 6 caracteres"
                                    className={`block w-full h-11 bg-gray-900/50 border rounded-lg pl-10 pr-10 text-sm outline-none transition-all
                                        ${errors.password1 ? "border-red-500/50 focus:ring-1 focus:ring-red-500 text-red-400 placeholder:text-red-400/60" : "border-white/10 focus:border-indigo-500 text-white placeholder:text-gray-500"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-400 transition-colors z-30 cursor-pointer focus:outline-none"
                                    title={
                                        showPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password1 && (
                                <p className="text-[10px] text-red-400 font-medium ml-1">
                                    {errors.password1}
                                </p>
                            )}
                        </div>

                        {/* Campo Confirmar Contraseña (¡Con ojito!) */}
                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-200 ml-1"
                            >
                                Confirmar contraseña
                            </label>
                            <div className="relative group flex items-center">
                                <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-20 translate-y-[1px]">
                                    <Lock
                                        className={`h-4 w-4 transition-colors ${errors.password2 ? "text-red-400" : "text-gray-500 group-focus-within:text-indigo-400"}`}
                                    />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "password2",
                                            e.target.value,
                                            setConfirmPassword,
                                        )
                                    }
                                    placeholder="Repetí tu contraseña"
                                    className={`block w-full h-11 bg-gray-900/50 border rounded-lg pl-10 pr-10 text-sm outline-none transition-all
                                        ${errors.password2 ? "border-red-500/50 focus:ring-1 focus:ring-red-500 text-red-400 placeholder:text-red-400/60" : "border-white/10 focus:border-indigo-500 text-white placeholder:text-gray-500"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-400 transition-colors z-30 cursor-pointer focus:outline-none"
                                    title={
                                        showConfirmPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password2 && (
                                <p className="text-[10px] text-red-400 font-medium ml-1">
                                    {errors.password2}
                                </p>
                            )}
                        </div>

                        {/* Botón Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-500 transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>{registerStatus}</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4" />
                                        <span>Crear cuenta</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Enlace al Login */}
                    <div className="mt-6 text-center border-t border-white/5 pt-6">
                        <p className="text-sm text-gray-400">
                            ¿Ya tenés una cuenta?{" "}
                            <a
                                href="/auth/login"
                                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Iniciá sesión
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer - Exactamente igual */}
                <p className="mt-8 text-center text-xs text-gray-500">
                    Desarrollado por{" "}
                    <span className="font-bold text-gray-400">OjiSoftware</span>{" "}
                    © 2026 •{" "}
                    <a
                        href="mailto:soporte@ojisoftware.com"
                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                        Soporte técnico
                    </a>
                </p>
            </div>
        </div>
    );
}
