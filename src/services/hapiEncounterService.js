import api from './api';

export const hapiEncounterService = {
    getAllEncounters: async () => {
        const response = await api.get('/hapi/encounters');
        return response.data;
    },

    getEncountersByPatientId: async (patientId) => {
        const response = await api.get(`/hapi/encounters/patient/${patientId}`);
        return response.data;
    },
};




