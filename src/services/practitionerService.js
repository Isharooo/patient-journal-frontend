import api from './api';

export const practitionerService = {
    getAllPractitioners: async () => {
        const response = await api.get('/practitioners');
        return response.data;
    },

    getPractitionerById: async (id) => {
        const response = await api.get(`/practitioners/${id}`);
        return response.data;
    },

    createPractitioner: async (practitionerData) => {
        const response = await api.post('/practitioners', practitionerData);
        return response.data;
    },
};