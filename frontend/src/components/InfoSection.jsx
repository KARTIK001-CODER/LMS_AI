import React from 'react';

const InfoSection = ({ title, children }) => {
    return (
        <div style={styles.section}>
            <h2 style={styles.title}>{title}</h2>
            <div style={styles.body}>{children}</div>
        </div>
    );
};

const styles = {
    section: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '28px 32px',
        marginBottom: '20px',
    },
    title: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2563EB',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        margin: '0 0 20px 0',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
};

export default InfoSection;
