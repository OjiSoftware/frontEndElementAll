import React, { useState, useEffect } from "react"; // 👈 Agregamos useEffect
import { useParams, useNavigate } from "react-router-dom";
import {
    Lock,
    CheckCircle2,
    Loader2,
    Eye,
    EyeOff,
    AlertCircle,
} from "lucide-react";
import { validatePassword } from "../../helpers/password.validator";
import logo from "../../assets/logo_elementAll.png";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errors, setErrors] = useState<{
        p1?: string;
        p2?: string;
        api?: string;
    }>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // 1. Estado para la verificación inicial del token
    const [isChecking, setIsChecking] = useState(true);

    // 2. Efecto para verificar el token apenas carga la página
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/auth/verify-token/${token}`,
                );
                const data = await response.json();

                if (!response.ok) {
                    setErrors({
                        api:
                            data.error ||
                            data.message ||
                            "El enlace ha expirado.",
                    });
                }
            } catch (err) {
                setErrors({ api: "Error al conectar con el servidor." });
            } finally {
                // Pequeño delay opcional para que la transición no sea brusca
                setTimeout(() => setIsChecking(false), 500);
            }
        };

        if (token) verifyToken();
    }, [token]);

    const handleInputChange = (
        field: "p1" | "p2",
        value: string,
        setter: (v: string) => void,
    ) => {
        setter(value);
        if (errors[field])
            setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};
        const p1Validation = validatePassword(pass);
        if (p1Validation.password1) newErrors.p1 = p1Validation.password1;

        if (!confirmPass) {
            newErrors.p2 = "Por favor, repetí la contraseña.";
        } else if (pass !== confirmPass) {
            newErrors.p2 = "Las contraseñas no coinciden.";
        }

        setErrors(newErrors);
        if (newErrors.p1 || newErrors.p2) return;

        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ token, newPassword: pass }),
                },
            );
            const data = await response.json();
            if (response.ok) setSuccess(true);
            else
                setErrors({
                    api: data.error || data.message || "Error al actualizar.",
                });
        } catch (err) {
            setErrors({ api: "Error de conexión." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4 py-4 font-sans text-white">
            <div className="w-full max-w-md flex flex-col items-center">
                <div className="w-full text-center mb-10">
                    <img
                        src={logo}
                        alt="ElementAll"
                        className="h-14 sm:h-16 w-auto block mx-auto mb-4 object-contain"
                    />
                    <p className="text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">
                        Seguridad de Cuenta
                    </p>
                </div>

                <div className="w-full bg-gray-800/50 border border-white/10 p-6 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-xl min-h-[300px] flex flex-col justify-center">
                    {/* 3. Renderizado Condicional según el estado de verificación */}
                    {isChecking ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
                            <p className="text-gray-400 text-sm">
                                Validando enlace...
                            </p>
                        </div>
                    ) : errors.api && !success ? (
                        /* 4. Si el token falló de entrada, mostramos el error y el botón de rescate */
                        <div className="text-center py-4">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">
                                Enlace no válido
                            </h2>
                            <p className="text-gray-400 text-sm mb-8">
                                {errors.api}
                            </p>
                            <button
                                onClick={() => navigate("/auth/recover")}
                                className="w-full py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition-all active:scale-95 cursor-pointer"
                            >
                                Solicitar nuevo correo
                            </button>
                        </div>
                    ) : !success ? (
                        <>
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Restablece tu contraseña
                                </h2>
                                <p className="text-gray-400 text-sm mt-2">
                                    Debe tener al menos 6 caracteres.
                                </p>
                            </div>

                            <form
                                onSubmit={handleReset}
                                className="space-y-6"
                                noValidate
                            >
                                {/* ... Tus campos de contraseña iguales a antes ... */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-200 ml-1">
                                        Nueva contraseña
                                    </label>
                                    <div className="relative group flex items-center">
                                        <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-20 translate-y-[1px]">
                                            <Lock
                                                className={`h-4 w-4 transition-colors ${errors.p1 ? "text-red-400" : "text-gray-500 group-focus-within:text-indigo-400"}`}
                                            />
                                        </div>
                                        <input
                                            type={
                                                showPass ? "text" : "password"
                                            }
                                            value={pass}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "p1",
                                                    e.target.value,
                                                    setPass,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className={`block w-full h-11 bg-gray-900/50 border rounded-lg pl-10 pr-10 text-sm outline-none transition-all
                                                ${errors.p1 ? "border-red-500/50 focus:ring-1 focus:ring-red-500 text-red-400 placeholder:text-red-400/60" : "border-white/10 focus:border-indigo-500 text-white placeholder:text-gray-500"}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPass(!showPass)
                                            }
                                            className="absolute right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-400 cursor-pointer"
                                        >
                                            {showPass ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.p1 && (
                                        <p className="text-[10px] text-red-400 font-medium ml-1">
                                            {errors.p1}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-200 ml-1">
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative group flex items-center">
                                        <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-20 translate-y-[1px]">
                                            <Lock
                                                className={`h-4 w-4 transition-colors ${errors.p2 ? "text-red-400" : "text-gray-500 group-focus-within:text-indigo-400"}`}
                                            />
                                        </div>
                                        <input
                                            type={
                                                showConfirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={confirmPass}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "p2",
                                                    e.target.value,
                                                    setConfirmPass,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className={`block w-full h-11 bg-gray-900/50 border rounded-lg pl-10 pr-10 text-sm outline-none transition-all
                                                ${errors.p2 ? "border-red-500/50 focus:ring-1 focus:ring-red-500 text-red-400 placeholder:text-red-400/60" : "border-white/10 focus:border-indigo-500 text-white placeholder:text-gray-500"}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirm(!showConfirm)
                                            }
                                            className="absolute right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-400 cursor-pointer"
                                        >
                                            {showConfirm ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.p2 && (
                                        <p className="text-[10px] text-red-400 font-medium ml-1">
                                            {errors.p2}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Actualizar contraseña"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                            <h2 className="text-xl font-bold">
                                ¡Contraseña actualizada!
                            </h2>
                            <p className="text-gray-400 text-sm mt-2 mb-8">
                                Ya podés ingresar a <strong>ElementAll</strong>{" "}
                                con tu nueva clave.
                            </p>
                            <button
                                onClick={() => navigate("/auth/login")}
                                className="block w-full py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition-all text-center cursor-pointer"
                            >
                                Ir al Login
                            </button>
                        </div>
                    )}
                </div>

                <p className="mt-8 text-center text-xs text-gray-500">
                    Desarrollado por{" "}
                    <span className="font-bold text-gray-400">OjiSoftware</span>{" "}
                    © 2026
                </p>
            </div>
        </div>
    );
}
