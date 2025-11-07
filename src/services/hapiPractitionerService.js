import api from './api';

export const hapiPractitionerService = {
    getAllPractitioners: async () => {
        const response = await api.get('/hapi/practitioners');
        return response.data;
    },

    getPractitionerById: async (id) => {
        const response = await api.get(`/hapi/practitioners/${id}`);
        return response.data;
    },
};