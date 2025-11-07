import api from './api';

export const hapiConditionService = {
    getAllConditions: async () => {
        const response = await api.get('/hapi/conditions');
        return response.data;
    },

    getConditionsByPatientId: async (patientId) => {
        const response = await api.get(`/hapi/conditions/patient/${patientId}`);
        return response.data;
    },
};