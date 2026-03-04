import { EmailError, PasswordError } from '..types/errors';


export const emailValidator = ({ email, action }: { email: string; action: (error: EmailError) => void }) => {
    const tempErrors: EmailError = {};
    if (!email) {
        tempErrors.email = 'El email es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        tempErrors.email = 'El formato del email no es válido.';
    }
    action(tempErrors);
};

export const validateLoginPassword = ({ password, action }: { password: string; action: React.Dispatch<React.SetStateAction<PasswordError>>; }) => {
    const tempErrors: PasswordError = {};
    if (!password) {
        tempErrors.password1 = 'La contraseña es obligatoria.';
    }
    action((prev: any) => ({ ...prev, ...tempErrors }));
};