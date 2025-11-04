import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { encounterService } from '../services/encounterService';
import { observationService } from '../services/observationService';
import { conditionService } from '../services/conditionService';

function PatientDetails() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [encounters, setEncounters] = useState([]);
    const [observations, setObservations] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('encounters');
    const navigate = useNavigate();

    useEffect(() => {
        loadPatientData();
    }, [id]);

    const loadPatientData = async () => {
        try {
            const patientData = await patientService.getPatientById(id);
            const encountersData = await encounterService.getEncountersByPatientId(id);
            const observationsData = await observationService.getObservationsByPatientId(id);
            const conditionsData = await conditionService.getConditionsByPatientId(id);

            setPatient(patientData);
            setEncounters(encountersData);
            setObservations(observationsData);
            setConditions(conditionsData);
        } catch (error) {
            console.error('Failed to load patient data:', error);
            alert('Failed to load patient data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
    if (!patient) return <div style={{ padding: '20px' }}>Patient not found</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Patient Details</h1>

            <div style={{ background: 'white', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
                <h2>{patient.user.firstName} {patient.user.lastName}</h2>
                <p><strong>Personal Number:</strong> {patient.personalNumber}</p>
                <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
                <p><strong>Email:</strong> {patient.user.email}</p>
                <p><strong>Address:</strong> {patient.address || 'N/A'}</p>
                <p><strong>Phone:</strong> {patient.phoneNumber || 'N/A'}</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate(`/patients/${id}/encounters/create`)}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                    }}
                >
                    + New Encounter
                </button>
                <button
                    onClick={() => navigate(`/patients/${id}/observations/create`)}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                    }}
                >
                    + New Observation
                </button>
                <button
                    onClick={() => navigate(`/patients/${id}/conditions/create`)}
                    style={{
                        padding: '10px 20px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                    }}
                >
                    + New Diagnosis
                </button>
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
                    Diagnoses ({conditions.length})
                </button>
            </div>

            {activeTab === 'encounters' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Encounters</h3>
                    {encounters.length === 0 ? (
                        <p>No encounters found</p>
                    ) : (
                        encounters.map((encounter) => (
                            <div key={encounter.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                                <p><strong>Date:</strong> {new Date(encounter.encounterDate).toLocaleString()}</p>
                                <p><strong>Practitioner:</strong> {encounter.practitionerName}</p>
                                <p><strong>Location:</strong> {encounter.locationName || 'N/A'}</p>
                                <p><strong>Notes:</strong> {encounter.notes}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'observations' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Observations</h3>
                    {observations.length === 0 ? (
                        <p>No observations found</p>
                    ) : (
                        observations.map((observation) => (
                            <div key={observation.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                                <p><strong>Date:</strong> {new Date(observation.observationDate).toLocaleString()}</p>
                                <p><strong>Type:</strong> {observation.observationType}</p>
                                <p><strong>Value:</strong> {observation.value}</p>
                                {observation.notes && <p><strong>Notes:</strong> {observation.notes}</p>}
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'conditions' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Diagnoses</h3>
                    {conditions.length === 0 ? (
                        <p>No diagnoses found</p>
                    ) : (
                        conditions.map((condition) => (
                            <div key={condition.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                                <p><strong>Date:</strong> {new Date(condition.diagnosedDate).toLocaleString()}</p>
                                <p><strong>Diagnosis:</strong> {condition.diagnosisName}</p>
                                <p><strong>Code:</strong> {condition.diagnosisCode}</p>
                                <p><strong>Diagnosed by:</strong> {condition.diagnosedByName}</p>
                                {condition.notes && <p><strong>Notes:</strong> {condition.notes}</p>}
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
}

export default PatientDetails;