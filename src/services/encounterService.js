import api from './api';

export const encounterService = {
    getAllEncounters: async () => {
        const response = await api.get('/encounters');
        return response.data;
    },

    getEncounterById: async (id) => {
        const response = await api.get(`/encounters/${id}`);
        return response.data;
    },

    getEncountersByPatientId: async (patientId) => {
        const response = await api.get(`/encounters/patient/${patientId}`);
        return response.data;
    },

    createEncounter: async (encounterData) => {
        const response = await api.post('/encounters', encounterData);
        return response.data;
    },

    updateEncounter: async (id, encounterData) => {
        const response = await api.put(`/encounters/${id}`, encounterData);
        return response.data;
    },
};
