import api from './api';

export const locationService = {
    getAllLocations: async () => {
        const response = await api.get('/locations');
        return response.data;
    },

    getLocationById: async (id) => {
        const response = await api.get(`/locations/${id}`);
        return response.data;
    },
};