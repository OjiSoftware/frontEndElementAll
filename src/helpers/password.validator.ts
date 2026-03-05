import { PasswordError } from "../types/errors.types";

export const validatePassword = (password: string): PasswordError => {
    const tempErrors: PasswordError = {};
    if (!password) {
        tempErrors.password1 = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
        tempErrors.password1 = "Mínimo 6 caracteres.";
    }
    return tempErrors;
};
