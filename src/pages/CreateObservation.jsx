import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observationService } from '../services/observationService';
import { patientService } from '../services/patientService';
import { encounterService } from '../services/encounterService';

function CreateObservation() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState(null);
    const [encounters, setEncounters] = useState([]);
    const [formData, setFormData] = useState({
        patientId: patientId || '',
        encounterId: '',
        observationType: '',
        value: '',
        notes: '',
    });

    useEffect(() => {
        loadData();
    }, [patientId]);

    const loadData = async () => {
        try {
            if (patientId) {
                const patientData = await patientService.getPatientById(patientId);
                setPatient(patientData);
                const encountersData = await encounterService.getEncountersByPatientId(patientId);
                setEncounters(encountersData);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const observationData = {
                patient: { id: parseInt(formData.patientId) },
                encounter: formData.encounterId ? { id: parseInt(formData.encounterId) } : null,
                observationType: formData.observationType,
                value: formData.value,
                notes: formData.notes,
            };

            await observationService.createObservation(observationData);
            alert('Observation created successfully!');
            navigate(`/patients/${formData.patientId}`);
        } catch (error) {
            console.error('Failed to create observation:', error);
            alert('Failed to create observation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Create Observation</h1>

            {patient && (
                <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                    <p><strong>Patient:</strong> {patient.user.firstName} {patient.user.lastName}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Encounter (optional)
                    </label>
                    <select
                        value={formData.encounterId}
                        onChange={(e) => setFormData({ ...formData, encounterId: e.target.value })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                    >
                        <option value="">No encounter</option>
                        {encounters.map((e) => (
                            <option key={e.id} value={e.id}>
                                {new Date(e.encounterDate).toLocaleDateString()} - {e.practitionerName}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Type *
                    </label>
                    <select
                        value={formData.observationType}
                        onChange={(e) => setFormData({ ...formData, observationType: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                    >
                        <option value="">Select Type</option>
                        <option value="Blood Pressure">Blood Pressure</option>
                        <option value="Heart Rate">Heart Rate</option>
                        <option value="Temperature">Temperature</option>
                        <option value="Weight">Weight</option>
                        <option value="Height">Height</option>
                        <option value="Oxygen Saturation">Oxygen Saturation</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Value *
                    </label>
                    <input
                        type="text"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                        placeholder="e.g., 120/80 mmHg, 72 bpm"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Notes
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                        }}
                    >
                        {loading ? 'Creating...' : 'Create Observation'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '10px 20px',
                            background: '#ddd',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateObservation;