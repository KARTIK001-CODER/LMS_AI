import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InfoSection from '../components/InfoSection';
import ChatbotButton from '../components/ChatbotButton';
import { getProfile } from '../services/profileService';

const Field = ({ label, value }) => (
    <div style={fieldStyles.row}>
        <span style={fieldStyles.label}>{label}</span>
        <span style={value ? fieldStyles.value : fieldStyles.empty}>
            {value || 'Not provided'}
        </span>
    </div>
);

const fieldStyles = {
    row: {
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
    },
    label: {
        fontSize: '12px',
        color: '#9CA3AF',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    value: {
        fontSize: '15px',
        color: '#111827',
        fontWeight: '400',
    },
    empty: {
        fontSize: '15px',
        color: '#D1D5DB',
        fontStyle: 'italic',
        fontWeight: '400',
    },
};

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

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getProfile()
            .then(setProfile)
            .catch((err) => {
                setError(err.message);
                if (err.message === 'No token found' || err.message === 'Unauthorized') {
                    navigate('/login');
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

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
                        {/* Personal */}
                        <InfoSection title="Personal">
                            <Field label="Name" value={profile.personal?.full_name} />
                            <Field label="Email" value={profile.personal?.email} />
                            <Field label="Phone" value={profile.personal?.phone} />
                            <Field label="City" value={profile.personal?.city} />
                        </InfoSection>

                        {/* Education */}
                        <InfoSection title="Education">
                            {profile.education ? (
                                <>
                                    <Field label="10th Board" value={profile.education.tenth_board} />
                                    <Field label="10th Percentage" value={profile.education.tenth_percentage ? `${profile.education.tenth_percentage}%` : null} />
                                    <Field label="12th Board" value={profile.education.twelfth_board} />
                                    <Field label="12th Percentage" value={profile.education.twelfth_percentage ? `${profile.education.twelfth_percentage}%` : null} />
                                </>
                            ) : (
                                <p style={styles.missing}>No education details on file.</p>
                            )}
                        </InfoSection>

                        {/* Course */}
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
    loading: {
        color: '#9CA3AF',
        fontSize: '15px',
    },
    error: {
        color: '#B91C1C',
        backgroundColor: '#FEF2F2',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
    },
    missing: {
        color: '#9CA3AF',
        fontSize: '14px',
        fontStyle: 'italic',
        margin: 0,
    },
};

export default Profile;
