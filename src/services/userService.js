import api from './api';

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    getUsersByRole: async (role) => {
        const response = await api.get(`/users/role/${role}`);
        return response.data;
    },
};