import { PasswordError } from "../types/errors.types";

export const validatePassword = (password: string): PasswordError => {
    const tempErrors: PasswordError = {};

    if (!password || password.trim().length === 0) {
        tempErrors.password1 = "La contraseña es obligatoria.";
        return tempErrors;
    }

    if (password.length < 6) {
        tempErrors.password1 = "Debe tener al menos 6 caracteres.";
        return tempErrors;
    }

    // 3. Validacion opcional
    /*
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    if (!hasNumber || !hasUpper) {
        tempErrors.password1 = "Usa al menos una mayúscula y un número.";
    }
    */

    return tempErrors;
};
