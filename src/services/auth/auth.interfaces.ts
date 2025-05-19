export interface BodyLogin {
    username: string;
    password: string;
}

export interface BodyRecoverPassword {
    email: string;
    password: string;
    confirmPassword: string;
}