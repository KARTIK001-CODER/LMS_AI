import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatbotButton from '../components/ChatbotButton';
import { getProfile, updatePersonal, updateEducation } from '../services/profileService';

const styles = {
    root: {
        margin: 0,
        padding: 0,
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        color: "#111827",
    },
    main: {
        maxWidth: "700px",
        margin: "0 auto",
        padding: "40px 20px 120px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    pageHeader: {
        marginBottom: "8px",
    },
    pageTitle: {
        fontSize: "22px",
        fontWeight: "700",
        letterSpacing: "-0.4px",
        color: "#111827",
        margin: 0,
    },
    pageSubtitle: {
        fontSize: "14px",
        color: "#6B7280",
        margin: "4px 0 0",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        padding: "24px",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    cardTitle: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#111827",
        margin: 0,
        letterSpacing: "0.1px",
    },
    editBtn: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#2563EB",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px 0",
        transition: "opacity 0.15s",
    },
    fieldRow: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        paddingBottom: "16px",
        marginBottom: "16px",
        borderBottom: "1px solid #F3F4F6",
    },
    fieldRowLast: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        paddingBottom: 0,
        marginBottom: 0,
    },
    fieldLabel: {
        fontSize: "12px",
        fontWeight: "500",
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    fieldValue: {
        fontSize: "15px",
        fontWeight: "500",
        color: "#111827",
    },
    input: {
        fontSize: "14px",
        color: "#111827",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        padding: "8px 12px",
        width: "100%",
        outline: "none",
        fontFamily: "inherit",
        backgroundColor: "#F9FAFB",
        transition: "border-color 0.15s",
        boxSizing: "border-box",
    },
    actionRow: {
        display: "flex",
        gap: "10px",
        marginTop: "20px",
    },
    saveBtn: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#FFFFFF",
        backgroundColor: "#2563EB",
        border: "none",
        borderRadius: "8px",
        padding: "8px 18px",
        cursor: "pointer",
        transition: "background-color 0.15s",
    },
    cancelBtn: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#6B7280",
        backgroundColor: "transparent",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        padding: "8px 18px",
        cursor: "pointer",
        transition: "border-color 0.15s",
    },
    avatar: {
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        backgroundColor: "#EFF6FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "700",
        color: "#2563EB",
        marginBottom: "16px",
        flexShrink: 0,
    },
    avatarRow: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "20px",
        paddingBottom: "20px",
        borderBottom: "1px solid #F3F4F6",
    },
    avatarMeta: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    avatarName: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#111827",
    },
    avatarRole: {
        fontSize: "13px",
        color: "#6B7280",
    },
    badge: {
        display: "inline-block",
        fontSize: "12px",
        fontWeight: "600",
        color: "#15803D",
        backgroundColor: "#F0FDF4",
        borderRadius: "6px",
        padding: "3px 10px",
        textTransform: "capitalize",
    },
    progressWrap: {
        marginTop: "6px",
    },
    progressBar: {
        height: "5px",
        backgroundColor: "#E5E7EB",
        borderRadius: "99px",
        overflow: "hidden",
        marginTop: "8px",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#2563EB",
        borderRadius: "99px",
        transition: "width 0.3s",
    },
    progressLabel: {
        fontSize: "12px",
        color: "#9CA3AF",
        marginTop: "5px",
    },
};

function Field({ label, value, editing, name, onChange, isLast, editable }) {
    return (
        <div style={isLast ? styles.fieldRowLast : styles.fieldRow}>
            <span style={styles.fieldLabel}>{label}</span>
            {editing && editable ? (
                <input
                    style={styles.input}
                    value={value || ""}
                    name={name}
                    onChange={onChange}
                    onFocus={e => (e.target.style.borderColor = "#2563EB")}
                    onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                />
            ) : (
                <span style={value ? styles.fieldValue : { ...styles.fieldValue, color: "#D1D5DB", fontStyle: "italic" }}>
                    {value || "Not provided"}
                </span>
            )}
        </div>
    );
}

function Section({ title, fields, showAvatar, avatarInitials, avatarName, avatarRole, onSaveReq }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(() =>
        Object.fromEntries(fields.map(f => [f.name, f.value || ""]))
    );
    const [saving, setSaving] = useState(false);

    // Sync draft when fields change to maintain up-to-date state
    useEffect(() => {
        setDraft(Object.fromEntries(fields.map(f => [f.name, f.value || ""])));
    }, [fields]);

    const handleChange = e => setDraft(d => ({ ...d, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSaveReq(draft);
            setEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setDraft(Object.fromEntries(fields.map(f => [f.name, f.value || ""])));
        setEditing(false);
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>{title}</span>
                {!editing && (
                    <button style={styles.editBtn} onClick={() => setEditing(true)}
                        onMouseEnter={e => (e.target.style.opacity = "0.65")}
                        onMouseLeave={e => (e.target.style.opacity = "1")}>
                        Edit
                    </button>
                )}
            </div>

            {showAvatar && (
                <div style={styles.avatarRow}>
                    <div style={{ ...styles.avatar, marginBottom: 0 }}>{avatarInitials || "?"}</div>
                    <div style={styles.avatarMeta}>
                        <span style={styles.avatarName}>{avatarName || "Unknown"}</span>
                        <span style={styles.avatarRole}>{avatarRole}</span>
                    </div>
                </div>
            )}

            {fields.map((f, i) => (
                <Field
                    key={f.name}
                    label={f.label}
                    value={editing && f.editable !== false ? draft[f.name] : f.value}
                    editing={editing}
                    name={f.name}
                    onChange={handleChange}
                    isLast={i === fields.length - 1}
                    editable={f.editable !== false}
                />
            ))}

            {editing && (
                <div style={styles.actionRow}>
                    <button style={styles.saveBtn} onClick={handleSave} disabled={saving}
                        onMouseEnter={e => (e.target.style.backgroundColor = "#1D4ED8")}
                        onMouseLeave={e => (e.target.style.backgroundColor = "#2563EB")}>
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                    <button style={styles.cancelBtn} onClick={handleCancel} disabled={saving}
                        onMouseEnter={e => (e.target.style.borderColor = "#9CA3AF")}
                        onMouseLeave={e => (e.target.style.borderColor = "#E5E7EB")}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProfile = useCallback(() => {
        setLoading(true);
        getProfile()
            .then((data) => setProfile(data))
            .catch((err) => {
                setError(err.message);
                if (err.message === 'No token found' || err.message === 'Unauthorized') {
                    navigate('/login');
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    const handlePersonalSave = useCallback(async (draft) => {
        await updatePersonal(draft);
        fetchProfile();
    }, [fetchProfile]);

    const handleEducationSave = useCallback(async (draft) => {
        await updateEducation(draft);
        fetchProfile();
    }, [fetchProfile]);

    const personalFields = useMemo(() => [
        { name: 'full_name', label: 'Full Name', value: profile?.personal?.full_name },
        { name: 'email', label: 'Email Address', value: profile?.personal?.email, editable: false },
        { name: 'phone', label: 'Phone Number', value: profile?.personal?.phone },
        { name: 'city', label: 'Location / City', value: profile?.personal?.city },
    ], [profile?.personal?.full_name, profile?.personal?.email, profile?.personal?.phone, profile?.personal?.city]);

    const educationFields = useMemo(() => [
        { name: 'tenth_board', label: '10th Board', value: profile?.education?.tenth_board },
        { name: 'tenth_percentage', label: '10th Percentage', value: profile?.education?.tenth_percentage },
        { name: 'twelfth_board', label: '12th Board', value: profile?.education?.twelfth_board },
        { name: 'twelfth_percentage', label: '12th Percentage', value: profile?.education?.twelfth_percentage },
    ], [profile?.education?.tenth_board, profile?.education?.tenth_percentage, profile?.education?.twelfth_board, profile?.education?.twelfth_percentage]);

    let initials = "UU";
    let fullName = "Unknown User";
    let roleStr = "Learner";

    if (profile?.personal?.full_name) {
        fullName = profile.personal.full_name;
        const parts = fullName.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        } else if (parts.length === 1) {
            initials = parts[0].substring(0, 2).toUpperCase();
        }
    }

    return (
        <div style={styles.root}>
            {/* Google Font */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

            {/* Nav */}
            <Navbar />

            {/* Main */}
            <main style={styles.main}>
                <div style={styles.pageHeader}>
                    <h1 style={styles.pageTitle}>My Profile</h1>
                    <p style={styles.pageSubtitle}>Manage your personal information and learning details</p>
                </div>

                {loading && <p style={{ color: '#9CA3AF', fontSize: '15px' }}>Loading…</p>}

                {error && !loading && (
                    <p style={{
                        color: '#B91C1C',
                        backgroundColor: '#FEF2F2',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        marginTop: '10px'
                    }}>{error}</p>
                )}

                {profile && (
                    <>
                        {/* Personal Information */}
                        <Section
                            title="Personal Information"
                            showAvatar
                            avatarInitials={initials}
                            avatarName={fullName}
                            avatarRole={roleStr}
                            onSaveReq={handlePersonalSave}
                            fields={personalFields}
                        />

                        {/* Education */}
                        <Section
                            title="Education"
                            onSaveReq={handleEducationSave}
                            fields={educationFields}
                        />

                        {/* Course Details */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.cardTitle}>Course Details</span>
                            </div>
                            {profile.course ? (
                                <>
                                    <div style={styles.fieldRow}>
                                        <span style={styles.fieldLabel}>Course</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px" }}>
                                            <span style={styles.fieldValue}>{profile.course.title}</span>
                                            <span style={styles.badge}>{profile.course.status}</span>
                                        </div>
                                    </div>

                                    <div style={styles.fieldRow}>
                                        <span style={styles.fieldLabel}>Duration</span>
                                        <span style={styles.fieldValue}>{profile.course.duration_months ? `${profile.course.duration_months} months` : 'Not provided'}</span>
                                    </div>

                                    <div style={styles.fieldRow}>
                                        <span style={styles.fieldLabel}>Fee</span>
                                        <span style={styles.fieldValue}>{profile.course.fee ? `₹${Number(profile.course.fee).toLocaleString('en-IN')}` : 'Not provided'}</span>
                                    </div>

                                    <div style={styles.fieldRowLast}>
                                        <span style={styles.fieldLabel}>Overall Progress</span>
                                        <div style={styles.progressWrap}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={styles.fieldValue}>0% complete</span>
                                            </div>
                                            <div style={styles.progressBar}>
                                                <div style={{ ...styles.progressFill, width: "0%" }} />
                                            </div>
                                            <span style={styles.progressLabel}>Course progress not available</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p style={{ color: '#9CA3AF', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>No active course application.</p>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Floating AI Chatbot Button */}
            <ChatbotButton onUpdate={fetchProfile} />
        </div>
    );
}
