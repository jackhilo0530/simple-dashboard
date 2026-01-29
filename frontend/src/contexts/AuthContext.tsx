import { createContext } from "react";

interface AuthData {
    token: string;
    signin(data: string): Promise<void>;
    logout(): void;
}

export const AuthContext = createContext<AuthData | null>(null);
