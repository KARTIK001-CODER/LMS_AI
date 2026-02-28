import React from 'react';

const iconMap = {
    'Personal Information': (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    'Education Details': (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    ),
    'Course Information': (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
        </svg>
    ),
};

const ProfileCard = ({ title, children }) => {
    const icon = iconMap[title] || null;

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                {icon && <div style={styles.iconWrapper}>{icon}</div>}
                <div>
                    <h2 style={styles.title}>{title}</h2>
                </div>
            </div>
            <div style={styles.divider} />
            <div style={styles.body}>{children}</div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.05)',
        marginBottom: '24px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 28px',
        backgroundColor: '#FAFAFA',
        borderBottom: '1px solid #F1F5F9',
    },
    iconWrapper: {
        width: '38px',
        height: '38px',
        backgroundColor: '#EFF6FF',
        borderRadius: '10px',
        color: '#2563EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    title: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#0F172A',
        margin: 0,
        letterSpacing: '-0.2px',
    },
    divider: {
        display: 'none', // Already using border on header
    },
    body: {
        padding: '24px 28px',
    },
};

export default ProfileCard;
