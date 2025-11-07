import api from './api';

export const hapiObservationService = {
    getAllObservations: async () => {
        const response = await api.get('/hapi/observations');
        return response.data;
    },

    getObservationsByPatientId: async (patientId) => {
        const response = await api.get(`/hapi/observations/patient/${patientId}`);
        return response.data;
    },
};