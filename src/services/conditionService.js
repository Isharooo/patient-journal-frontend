import api from './api';

export const conditionService = {
    getAllConditions: async () => {
        const response = await api.get('/conditions');
        return response.data;
    },

    getConditionById: async (id) => {
        const response = await api.get(`/conditions/${id}`);
        return response.data;
    },

    getConditionsByPatientId: async (patientId) => {
        const response = await api.get(`/conditions/patient/${patientId}`);
        return response.data;
    },

    createCondition: async (conditionData) => {
        const response = await api.post('/conditions', conditionData);
        return response.data;
    },

    updateCondition: async (id, conditionData) => {
        const response = await api.put(`/conditions/${id}`, conditionData);
        return response.data;
    },
};