
const API_URL = 'http://localhost:5000/api';

// Helper para obtener los headers de autenticación
const getAuthHeaders = (isFormData = false) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: any = {
        'Authorization': token ? `Bearer ${token}` : '',
    };
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

// --- Funciones de Autenticación ---

export const registerUser = async (userData: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
    }
    return res.json();
};

export const loginUser = async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
    }
    const data = await res.json();
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const logoutUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
};

// --- Funciones de Usuario ---

export const getUserRequests = async () => {
    const res = await fetch(`${API_URL}/requests`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        if (res.status === 401) logoutUser();
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al obtener las solicitudes');
    }
    return res.json();
};

export const createRequest = async (formData: FormData) => {
    const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
    });
    if (!res.ok) {
        if (res.status === 401) logoutUser();
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear la solicitud');
    }
    return res.json();
};

// --- Funciones de Admin ---

export const getAllRequests = async () => {
    const res = await fetch(`${API_URL}/admin/requests`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        if (res.status === 401 || res.status === 403) logoutUser();
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al obtener todas las solicitudes');
    }
    return res.json();
};

export const getRequestById = async (id: string) => {
    const res = await fetch(`${API_URL}/admin/requests/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        if (res.status === 401 || res.status === 403) logoutUser();
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al obtener la solicitud');
    }
    return res.json();
};

export const updateRequestStatus = async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/admin/requests/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    if (!res.ok) {
        if (res.status === 401 || res.status === 403) logoutUser();
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar el estado');
    }
    return res.json();
};
