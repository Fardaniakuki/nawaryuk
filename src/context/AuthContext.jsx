import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
const API = '/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const apiFetch = async (path, opts = {}) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}${path}`, {
            ...opts,
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error');
        return data;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            apiFetch('/auth/me').then(u => setUser(u)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
        } else { setLoading(false); }
    }, []);

    const login = async (username, password) => {
        const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    const register = async (body) => {
        const data = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => { localStorage.removeItem('token'); setUser(null); };

    return <AuthContext.Provider value={{ user, loading, login, register, logout, apiFetch }}>{children}</AuthContext.Provider>;
}
