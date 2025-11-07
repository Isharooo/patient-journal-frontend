import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hapiPatientService } from '../services/hapiPatientService';
import { hapiEncounterService } from '../services/hapiEncounterService';
import { hapiObservationService } from '../services/hapiObservationService';
import { hapiConditionService } from '../services/hapiConditionService';

function HapiPatientDetails() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [encounters, setEncounters] = useState([]);
    const [observations, setObservations] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('encounters');
    const navigate = useNavigate();

    useEffect(() => {
        loadPatientData();
    }, [id]);

    const loadPatientData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load patient data
            const patientData = await hapiPatientService.getPatientById(id);
            setPatient(patientData);

            // Load related data
            const [encountersData, observationsData, conditionsData] = await Promise.all([
                hapiEncounterService.getEncountersByPatientId(id),
                hapiObservationService.getObservationsByPatientId(id),
                hapiConditionService.getConditionsByPatientId(id)
            ]);

            setEncounters(encountersData);
            setObservations(observationsData);
            setConditions(conditionsData);
        } catch (error) {
            console.error('Failed to load patient data from HAPI:', error);
            setError('Failed to load patient data from HAPI FHIR server');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading patient data from HAPI FHIR server...</div>;

    if (error) return (
        <div style={{ padding: '20px', color: 'red' }}>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/hapi/patients')}>Back to Patient List</button>
        </div>
    );

    if (!patient) return <div style={{ padding: '20px' }}>Patient not found in HAPI FHIR server</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/hapi/patients')}
                style={{
                    padding: '8px 16px',
                    background: '#ddd',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                ← Back to Patient List
            </button>

            <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
                <p style={{ margin: 0 }}>
                    <strong>Data Source:</strong> HAPI FHIR Server
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
                    FHIR ID: {patient.id}
                </p>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
                <h2>Patient Information</h2>
                <div style={{ marginTop: '15px' }}>
                    <p><strong>Name:</strong> {patient.user?.firstName} {patient.user?.lastName}</p>
                    <p><strong>FHIR Resource ID:</strong> {patient.id}</p>
                    <p><strong>Personal Number:</strong> {patient.personalNumber || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> {patient.dateOfBirth || 'N/A'}</p>
                    <p><strong>Address:</strong> {patient.address || 'N/A'}</p>
                    <p><strong>Phone:</strong> {patient.phoneNumber || 'N/A'}</p>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('encounters')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        background: activeTab === 'encounters' ? '#667eea' : '#eee',
                        color: activeTab === 'encounters' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Encounters ({encounters.length})
                </button>
                <button
                    onClick={() => setActiveTab('observations')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        background: activeTab === 'observations' ? '#667eea' : '#eee',
                        color: activeTab === 'observations' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Observations ({observations.length})
                </button>
                <button
                    onClick={() => setActiveTab('conditions')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'conditions' ? '#667eea' : '#eee',
                        color: activeTab === 'conditions' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Conditions ({conditions.length})
                </button>
            </div>

            {activeTab === 'encounters' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Encounters from HAPI FHIR</h3>
                    {encounters.length === 0 ? (
                        <p>No encounters found in HAPI FHIR server</p>
                    ) : (
                        encounters.map((encounter) => (
                            <div key={encounter.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                                <p><strong>FHIR ID:</strong> {encounter.id}</p>
                                <p><strong>Date:</strong> {encounter.encounterDate ? new Date(encounter.encounterDate).toLocaleString() : 'N/A'}</p>
                                <p><strong>Practitioner:</strong> {encounter.practitionerName || 'N/A'}</p>
                                <p><strong>Location:</strong> {encounter.locationName || 'N/A'}</p>
                                <p><strong>Notes:</strong> {encounter.notes || 'N/A'}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'observations' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Observations from HAPI FHIR</h3>
                    {observations.length === 0 ? (
                        <p>No observations found in HAPI FHIR server</p>
                    ) : (
                        observations.map((observation) => (
                            <div key={observation.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                                <p><strong>FHIR ID:</strong> {observation.id}</p>
                                <p><strong>Date:</strong> {observation.observationDate ? new Date(observation.observationDate).toLocaleString() : 'N/A'}</p>
                                <p><strong>Type:</strong> {observation.observationType || 'N/A'}</p>
                                <p><strong>Value:</strong> {observation.value || 'N/A'}</p>
                                {observation.notes && <p><strong>Notes:</strong> {observation.notes}</p>}
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'conditions' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Conditions from HAPI FHIR</h3>
                    {conditions.length === 0 ? (
                        <p>No conditions found in HAPI FHIR server</p>
                    ) : (
                        conditions.map((condition) => (
                            <div key={condition.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                                <p><strong>FHIR ID:</strong> {condition.id}</p>
                                <p><strong>Date:</strong> {condition.diagnosedDate ? new Date(condition.diagnosedDate).toLocaleString() : 'N/A'}</p>
                                <p><strong>Condition:</strong> {condition.diagnosisName || 'N/A'}</p>
                                <p><strong>Code:</strong> {condition.diagnosisCode || 'N/A'}</p>
                                <p><strong>Diagnosed by:</strong> {condition.diagnosedByName || 'N/A'}</p>
                                {condition.notes && <p><strong>Notes:</strong> {condition.notes}</p>}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default HapiPatientDetails;