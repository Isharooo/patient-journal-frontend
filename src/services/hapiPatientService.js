import api from './api';

export const hapiPatientService = {
    getAllPatients: async () => {
        const { data } = await api.get('/hapi/patients');
        return data;                // varje patient måste nu ha fhirId
    },
    getPatientById: async (fhirId) => {
        const { data } = await api.get(`/hapi/patients/${fhirId}`); // skicka sträng-id
        return data;
    },
    getPatientByPersonalNumber: async (pnr) => {
        const { data } = await api.get(`/hapi/patients/personal-number/${pnr}`);
        return data;
    },
};