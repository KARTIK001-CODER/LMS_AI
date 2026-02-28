import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InfoSection from '../components/InfoSection';
import ChatbotButton from '../components/ChatbotButton';
import { getProfile, updatePersonal, updateEducation } from '../services/profileService';

/* ---------- Small display-only field ---------- */
const Field = ({ label, value }) => (
    <div style={fieldStyles.row}>
        <span style={fieldStyles.label}>{label}</span>
        <span style={value ? fieldStyles.value : fieldStyles.empty}>
            {value || 'Not provided'}
        </span>
    </div>
);

/* ---------- Editable field ---------- */
const EditField = ({ label, name, value, onChange }) => (
    <div style={fieldStyles.row}>
        <label style={fieldStyles.label}>{label}</label>
        <input
            style={fieldStyles.input}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={`Enter ${label.toLowerCase()}`}
        />
    </div>
);

const fieldStyles = {
    row: { display: 'flex', flexDirection: 'column', gap: '4px' },
    label: {
        fontSize: '12px',
        color: '#9CA3AF',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    value: { fontSize: '15px', color: '#111827', fontWeight: '400' },
    empty: { fontSize: '15px', color: '#D1D5DB', fontStyle: 'italic', fontWeight: '400' },
    input: {
        fontSize: '15px',
        color: '#111827',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        padding: '7px 10px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#F9FAFB',
    },
};

/* ---------- Status pill (for course section) ---------- */
const StatusPill = ({ status }) => {
    const map = {
        approved: { bg: '#F0FDF4', color: '#15803D' },
        pending: { bg: '#FFFBEB', color: '#B45309' },
        rejected: { bg: '#FEF2F2', color: '#B91C1C' },
    };
    const s = map[status?.toLowerCase()] || { bg: '#F3F4F6', color: '#6B7280' };
    return (
        <span style={{ ...pillStyle, backgroundColor: s.bg, color: s.color }}>
            {status || 'Unknown'}
        </span>
    );
};

const pillStyle = {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
};

/* ---------- Main component ---------- */
const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Personal edit state
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [personalForm, setPersonalForm] = useState({ full_name: '', phone: '', city: '' });
    const [savingPersonal, setSavingPersonal] = useState(false);
    const [personalError, setPersonalError] = useState('');

    // Education edit state
    const [editingEducation, setEditingEducation] = useState(false);
    const [educationForm, setEducationForm] = useState({
        tenth_board: '', tenth_percentage: '', twelfth_board: '', twelfth_percentage: '',
    });
    const [savingEducation, setSavingEducation] = useState(false);
    const [educationError, setEducationError] = useState('');

    const fetchProfile = () => {
        setLoading(true);
        getProfile()
            .then((data) => {
                setProfile(data);
                setPersonalForm({
                    full_name: data.personal?.full_name || '',
                    phone: data.personal?.phone || '',
                    city: data.personal?.city || '',
                });
                setEducationForm({
                    tenth_board: data.education?.tenth_board || '',
                    tenth_percentage: data.education?.tenth_percentage || '',
                    twelfth_board: data.education?.twelfth_board || '',
                    twelfth_percentage: data.education?.twelfth_percentage || '',
                });
            })
            .catch((err) => {
                setError(err.message);
                if (err.message === 'No token found' || err.message === 'Unauthorized') {
                    navigate('/login');
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchProfile(); }, [navigate]);

    /* --- Personal handlers --- */
    const handlePersonalChange = (e) =>
        setPersonalForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handlePersonalSave = () => {
        setPersonalError('');
        setSavingPersonal(true);
        updatePersonal(personalForm)
            .then(() => {
                setEditingPersonal(false);
                fetchProfile();
            })
            .catch((err) => setPersonalError(err.message))
            .finally(() => setSavingPersonal(false));
    };

    const handlePersonalCancel = () => {
        setPersonalError('');
        setPersonalForm({
            full_name: profile?.personal?.full_name || '',
            phone: profile?.personal?.phone || '',
            city: profile?.personal?.city || '',
        });
        setEditingPersonal(false);
    };

    /* --- Education handlers --- */
    const handleEducationChange = (e) =>
        setEducationForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleEducationSave = () => {
        setEducationError('');
        setSavingEducation(true);
        updateEducation(educationForm)
            .then(() => {
                setEditingEducation(false);
                fetchProfile();
            })
            .catch((err) => setEducationError(err.message))
            .finally(() => setSavingEducation(false));
    };

    const handleEducationCancel = () => {
        setEducationError('');
        setEducationForm({
            tenth_board: profile?.education?.tenth_board || '',
            tenth_percentage: profile?.education?.tenth_percentage || '',
            twelfth_board: profile?.education?.twelfth_board || '',
            twelfth_percentage: profile?.education?.twelfth_percentage || '',
        });
        setEditingEducation(false);
    };

    return (
        <div style={styles.page}>
            <Navbar />

            <main style={styles.main}>
                <h1 style={styles.pageTitle}>Your Profile</h1>

                {loading && <p style={styles.loading}>Loading…</p>}

                {error && !loading && (
                    <p style={styles.error}>{error}</p>
                )}

                {profile && (
                    <>
                        {/* ---- Personal ---- */}
                        <InfoSection
                            title="Personal"
                            onEdit={() => setEditingPersonal(true)}
                            isEditing={editingPersonal}
                            onSave={handlePersonalSave}
                            onCancel={handlePersonalCancel}
                            saving={savingPersonal}
                        >
                            {editingPersonal ? (
                                <>
                                    <EditField label="Name" name="full_name" value={personalForm.full_name} onChange={handlePersonalChange} />
                                    <EditField label="Phone" name="phone" value={personalForm.phone} onChange={handlePersonalChange} />
                                    <EditField label="City" name="city" value={personalForm.city} onChange={handlePersonalChange} />
                                    {personalError && <p style={styles.inlineError}>{personalError}</p>}
                                </>
                            ) : (
                                <>
                                    <Field label="Name" value={profile.personal?.full_name} />
                                    <Field label="Email" value={profile.personal?.email} />
                                    <Field label="Phone" value={profile.personal?.phone} />
                                    <Field label="City" value={profile.personal?.city} />
                                </>
                            )}
                        </InfoSection>

                        {/* ---- Education ---- */}
                        <InfoSection
                            title="Education"
                            onEdit={() => setEditingEducation(true)}
                            isEditing={editingEducation}
                            onSave={handleEducationSave}
                            onCancel={handleEducationCancel}
                            saving={savingEducation}
                        >
                            {editingEducation ? (
                                <>
                                    <EditField label="10th Board" name="tenth_board" value={educationForm.tenth_board} onChange={handleEducationChange} />
                                    <EditField label="10th Percentage" name="tenth_percentage" value={educationForm.tenth_percentage} onChange={handleEducationChange} />
                                    <EditField label="12th Board" name="twelfth_board" value={educationForm.twelfth_board} onChange={handleEducationChange} />
                                    <EditField label="12th Percentage" name="twelfth_percentage" value={educationForm.twelfth_percentage} onChange={handleEducationChange} />
                                    {educationError && <p style={styles.inlineError}>{educationError}</p>}
                                </>
                            ) : (
                                profile.education ? (
                                    <>
                                        <Field label="10th Board" value={profile.education.tenth_board} />
                                        <Field label="10th Percentage" value={profile.education.tenth_percentage ? `${profile.education.tenth_percentage}%` : null} />
                                        <Field label="12th Board" value={profile.education.twelfth_board} />
                                        <Field label="12th Percentage" value={profile.education.twelfth_percentage ? `${profile.education.twelfth_percentage}%` : null} />
                                    </>
                                ) : (
                                    <p style={styles.missing}>No education details on file.</p>
                                )
                            )}
                        </InfoSection>

                        {/* ---- Course (read-only) ---- */}
                        <InfoSection title="Course">
                            {profile.course ? (
                                <>
                                    <Field label="Course" value={profile.course.title} />
                                    <Field label="Duration" value={profile.course.duration_months ? `${profile.course.duration_months} months` : null} />
                                    <Field label="Fee" value={profile.course.fee ? `₹${Number(profile.course.fee).toLocaleString('en-IN')}` : null} />
                                    <div style={fieldStyles.row}>
                                        <span style={fieldStyles.label}>Status</span>
                                        <StatusPill status={profile.course.status} />
                                    </div>
                                </>
                            ) : (
                                <p style={styles.missing}>No active course application.</p>
                            )}
                        </InfoSection>
                    </>
                )}
            </main>

            <ChatbotButton />
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    main: {
        maxWidth: '640px',
        margin: '0 auto',
        padding: '48px 24px 80px',
    },
    pageTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 28px 0',
        letterSpacing: '-0.3px',
    },
    loading: { color: '#9CA3AF', fontSize: '15px' },
    error: {
        color: '#B91C1C',
        backgroundColor: '#FEF2F2',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
    },
    inlineError: {
        color: '#B91C1C',
        fontSize: '13px',
        margin: '4px 0 0',
    },
    missing: {
        color: '#9CA3AF',
        fontSize: '14px',
        fontStyle: 'italic',
        margin: 0,
    },
};

export default Profile;
