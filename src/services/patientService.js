import api from './api';

export const patientService = {
    getAllPatients: async () => {
        const response = await api.get('/patients');
        return response.data;
    },

    getPatientById: async (id) => {
        const response = await api.get(`/patients/${id}`);
        return response.data;
    },

    getPatientByPersonalNumber: async (personalNumber) => {
        const response = await api.get(`/patients/personal-number/${personalNumber}`);
        return response.data;
    },

    createPatient: async (patientData) => {
        const response = await api.post('/patients', patientData);
        return response.data;
    },

    updatePatient: async (id, patientData) => {
        const response = await api.put(`/patients/${id}`, patientData);
        return response.data;
    },
};