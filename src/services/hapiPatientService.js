import api from './api';

export const hapiPatientService = {
    getAllPatients: async () => {
        const response = await api.get('/hapi/patients');
        return response.data;
    },

    getPatientById: async (id) => {
        const response = await api.get(`/hapi/patients/${id}`);
        return response.data;
    },

    getPatientByPersonalNumber: async (personalNumber) => {
        const response = await api.get(`/hapi/patients/personal-number/${personalNumber}`);
        return response.data;
    },
};