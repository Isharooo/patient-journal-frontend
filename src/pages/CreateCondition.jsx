import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { conditionService } from '../services/conditionService';
import { patientService } from '../services/patientService';
import { encounterService } from '../services/encounterService';
import { practitionerService } from '../services/practitionerService';

function CreateCondition() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState(null);
    const [encounters, setEncounters] = useState([]);
    const [practitioners, setPractitioners] = useState([]);
    const [formData, setFormData] = useState({
        patientId: patientId || '',
        encounterId: '',
        diagnosedById: '',
        diagnosisCode: '',
        diagnosisName: '',
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
            const practitionersData = await practitionerService.getAllPractitioners();
            setPractitioners(practitionersData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const conditionData = {
                patient: { id: parseInt(formData.patientId) },
                encounter: formData.encounterId ? { id: parseInt(formData.encounterId) } : null,
                diagnosedBy: { id: parseInt(formData.diagnosedById) },
                diagnosisCode: formData.diagnosisCode,
                diagnosisName: formData.diagnosisName,
                notes: formData.notes,
            };

            await conditionService.createCondition(conditionData);
            alert('Diagnosis created successfully!');
            navigate(`/patients/${formData.patientId}`);
        } catch (error) {
            console.error('Failed to create diagnosis:', error);
            alert('Failed to create diagnosis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Create Diagnosis</h1>

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
                        Diagnosed By *
                    </label>
                    <select
                        value={formData.diagnosedById}
                        onChange={(e) => setFormData({ ...formData, diagnosedById: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                    >
                        <option value="">Select Practitioner</option>
                        {practitioners.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.user.firstName} {p.user.lastName} - {p.specialization}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Diagnosis Code (ICD-10) *
                    </label>
                    <input
                        type="text"
                        value={formData.diagnosisCode}
                        onChange={(e) => setFormData({ ...formData, diagnosisCode: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                        placeholder="e.g., I20.0"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Diagnosis Name *
                    </label>
                    <input
                        type="text"
                        value={formData.diagnosisName}
                        onChange={(e) => setFormData({ ...formData, diagnosisName: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                        placeholder="e.g., Unstable angina"
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
                        {loading ? 'Creating...' : 'Create Diagnosis'}
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

export default CreateCondition;