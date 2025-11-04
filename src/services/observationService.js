import api from './api';

export const observationService = {
    getAllObservations: async () => {
        const response = await api.get('/observations');
        return response.data;
    },

    getObservationById: async (id) => {
        const response = await api.get(`/observations/${id}`);
        return response.data;
    },

    getObservationsByPatientId: async (patientId) => {
        const response = await api.get(`/observations/patient/${patientId}`);
        return response.data;
    },

    createObservation: async (observationData) => {
        const response = await api.post('/observations', observationData);
        return response.data;
    },

    updateObservation: async (id, observationData) => {
        const response = await api.put(`/observations/${id}`, observationData);
        return response.data;
    },
};