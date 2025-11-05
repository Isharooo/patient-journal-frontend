import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { patientService } from '../services/patientService';
import { encounterService } from '../services/encounterService';
import { observationService } from '../services/observationService';
import { conditionService } from '../services/conditionService';

function PatientDashboard() {
    const { user } = useAuth();
    const [patient, setPatient] = useState(null);
    const [encounters, setEncounters] = useState([]);
    const [observations, setObservations] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        loadPatientData();
    }, []);

    const loadPatientData = async () => {
        try {
            // Hitta patient baserat pÃ¥ user ID
            const allPatients = await patientService.getAllPatients();
            const myPatient = allPatients.find(p => p.user.id === user.id);

            if (myPatient) {
                setPatient(myPatient);
                const encountersData = await encounterService.getEncountersByPatientId(myPatient.id);
                const observationsData = await observationService.getObservationsByPatientId(myPatient.id);
                const conditionsData = await conditionService.getConditionsByPatientId(myPatient.id);

                setEncounters(encountersData);
                setObservations(observationsData);
                setConditions(conditionsData);
            }
        } catch (error) {
            console.error('Failed to load patient data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

    if (!patient) {
        return (
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px', textAlign: 'center' }}>
                    <h2>No Patient Profile Found</h2>
                    <p>Your account is not linked to a patient profile yet.</p>
                    <p>Please contact your healthcare provider.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>My Health Information</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Welcome, {user.firstName} {user.lastName}
            </p>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('info')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        background: activeTab === 'info' ? '#667eea' : '#eee',
                        color: activeTab === 'info' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    My Information
                </button>
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
                    Visits ({encounters.length})
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
                    Measurements ({observations.length})
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

            {activeTab === 'info' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h2>Personal Information</h2>
                    <div style={{ marginTop: '20px' }}>
                        <p><strong>Name:</strong> {patient.user.firstName} {patient.user.lastName}</p>
                        <p><strong>Personal Number:</strong> {patient.personalNumber}</p>
                        <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
                        <p><strong>Email:</strong> {patient.user.email}</p>
                        <p><strong>Phone:</strong> {patient.phoneNumber || 'N/A'}</p>
                        <p><strong>Address:</strong> {patient.address || 'N/A'}</p>
                    </div>
                </div>
            )}

            {activeTab === 'encounters' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h2>My Visits</h2>
                    {encounters.length === 0 ? (
                        <p>No visits recorded</p>
                    ) : (
                        encounters.map((encounter) => (
                            <div key={encounter.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                                <p><strong>Date:</strong> {new Date(encounter.encounterDate).toLocaleString()}</p>
                                <p><strong>Healthcare Provider:</strong> {encounter.practitionerName}</p>
                                {encounter.locationName && <p><strong>Location:</strong> {encounter.locationName}</p>}
                                <p><strong>Notes:</strong> {encounter.notes}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'observations' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h2>My Measurements</h2>
                    {observations.length === 0 ? (
                        <p>No measurements recorded</p>
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
                    <h2>My Diagnoses</h2>
                    {conditions.length === 0 ? (
                        <p>No diagnoses recorded</p>
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

export default PatientDashboard;