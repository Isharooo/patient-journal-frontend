import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { encounterService } from '../services/encounterService';
import { patientService } from '../services/patientService';
import { practitionerService } from '../services/practitionerService';
import { locationService } from '../services/locationService';

function CreateEncounter() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState(null);
    const [practitioners, setPractitioners] = useState([]);
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({
        patientId: patientId || '',
        practitionerId: '',
        locationId: '',
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
            }
            const practitionersData = await practitionerService.getAllPractitioners();
            setPractitioners(practitionersData);

            const locationsData = await locationService.getAllLocations();
            setLocations(locationsData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const encounterData = {
                patient: { id: parseInt(formData.patientId) },
                practitioner: { id: parseInt(formData.practitionerId) },
                location: formData.locationId ? { id: parseInt(formData.locationId) } : null,
                notes: formData.notes,
            };

            await encounterService.createEncounter(encounterData);
            alert('Encounter created successfully!');
            navigate(`/patients/${formData.patientId}`);
        } catch (error) {
            console.error('Failed to create encounter:', error);
            alert('Failed to create encounter');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Create Encounter</h1>

            {patient && (
                <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                    <p><strong>Patient:</strong> {patient.user.firstName} {patient.user.lastName}</p>
                    <p><strong>Personal Number:</strong> {patient.personalNumber}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Practitioner *
                    </label>
                    <select
                        value={formData.practitionerId}
                        onChange={(e) => setFormData({ ...formData, practitionerId: e.target.value })}
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
                        Location
                    </label>
                    <select
                        value={formData.locationId}
                        onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                    >
                        <option value="">Select Location</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Notes *
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        required
                        rows={6}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
                        placeholder="Enter encounter notes..."
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
                        {loading ? 'Creating...' : 'Create Encounter'}
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

export default CreateEncounter;