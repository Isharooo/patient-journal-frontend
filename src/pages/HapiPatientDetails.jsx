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

    // Vi delar upp loading och error för varje datatyp
    const [loadingPatient, setLoadingPatient] = useState(true);
    const [loadingRelatedData, setLoadingRelatedData] = useState(true);

    const [patientError, setPatientError] = useState(null);
    const [relatedDataError, setRelatedDataError] = useState(null);

    const [activeTab, setActiveTab] = useState('encounters');
    const navigate = useNavigate();

    useEffect(() => {
        loadPatientData();
    }, [id]);

    const loadPatientData = async () => {
        // Återställ allt vid nyladdning
        setLoadingPatient(true);
        setLoadingRelatedData(true);
        setPatientError(null);
        setRelatedDataError(null);
        setPatient(null);
        setEncounters([]);
        setObservations([]);
        setConditions([]);

        // ---- STEG 1: FÖRSÖK HÄMTA PATIENTEN ----
        // Detta är anropet som misslyckas just nu
        try {
            const patientData = await hapiPatientService.getPatientById(id);
            setPatient(patientData);
        } catch (error) {
            console.error('Failed to load HAPI Patient:', error);
            if (error.response && error.response.status === 404) {
                setPatientError(`Patient resource with ID ${id} was not found on the HAPI FHIR server (404).`);
            } else {
                setPatientError('Failed to load patient data from HAPI FHIR server.');
            }
        } finally {
            setLoadingPatient(false);
        }

        // ---- STEG 2: HÄMTA ALLTID RELATERAD DATA ----
        // Vi kör detta oavsett om steg 1 lyckades eller inte.
        // Detta låter oss se journalen även om patient-resursen är trasig.
        try {
            const [encountersData, observationsData, conditionsData] = await Promise.all([
                hapiEncounterService.getEncountersByPatientId(id),
                hapiObservationService.getObservationsByPatientId(id),
                hapiConditionService.getConditionsByPatientId(id)
            ]);

            setEncounters(encountersData);
            setObservations(observationsData);
            setConditions(conditionsData);
        } catch (error) {
            console.error('Failed to load related HAPI data:', error);
            setRelatedDataError('Failed to load encounters, observations, or conditions.');
        } finally {
            setLoadingRelatedData(false);
        }
    };

    const isLoading = loadingPatient || loadingRelatedData;

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
                    FHIR Patient ID: {id}
                </p>
            </div>

            {/* --- Patientinformation --- */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
                <h2>Patient Information</h2>
                {loadingPatient && <p>Loading patient info...</p>}

                {patientError && (
                    <div style={{ color: 'red', background: '#fff0f0', padding: '10px', borderRadius: '5px' }}>
                        <strong>Error:</strong> {patientError}
                        <p style={{ fontSize: '0.9em', margin: '5px 0 0 0' }}>This is likely an inconsistency on the external HAPI server. Related data (below) may still load correctly.</p>
                    </div>
                )}

                {patient && (
                    <div style={{ marginTop: '15px' }}>
                        {/* Använd den nya DTO-strukturen från "Ny Lösning" */}
                        <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
                        <p><strong>FHIR Resource ID:</strong> {patient.id}</p>
                        <p><strong>Personal Number:</strong> {patient.personalNumber || 'N/A'}</p>
                        <p><strong>Date of Birth:</strong> {patient.dateOfBirth || 'N/A'}</p>
                        <p><strong>Address:</strong> {patient.address || 'N/A'}</p>
                        <p><strong>Phone:</strong> {patient.phoneNumber || 'N/A'}</p>
                    </div>
                )}
            </div>

            {/* --- Flikar för relaterad data --- */}
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
                    Encounters {loadingRelatedData ? '(...)' : `(${encounters.length})`}
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
                    Observations {loadingRelatedData ? '(...)' : `(${observations.length})`}
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
                    Conditions {loadingRelatedData ? '(...)' : `(${conditions.length})`}
                </button>
            </div>

            {relatedDataError && (
                <div style={{ color: 'red', background: '#fff0f0', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
                    <strong>Error:</strong> {relatedDataError}
                </div>
            )}

            {activeTab === 'encounters' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Encounters from HAPI FHIR</h3>
                    {loadingRelatedData ? <p>Loading encounters...</p> : (
                        encounters.length === 0 ? (
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
                        )
                    )}
                </div>
            )}

            {activeTab === 'observations' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Observations from HAPI FHIR</h3>
                    {loadingRelatedData ? <p>Loading observations...</p> : (
                        observations.length === 0 ? (
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
                        )
                    )}
                </div>
            )}

            {activeTab === 'conditions' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Conditions from HAPI FHIR</h3>
                    {loadingRelatedData ? <p>Loading conditions...</p> : (
                        conditions.length === 0 ? (
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
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default HapiPatientDetails;