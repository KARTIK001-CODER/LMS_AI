import React from 'react';

const InfoSection = ({ title, children, onEdit, isEditing, onSave, onCancel, saving }) => {
    return (
        <div style={styles.section}>
            <div style={styles.header}>
                <h2 style={styles.title}>{title}</h2>
                {!isEditing && onEdit && (
                    <button style={styles.editBtn} onClick={onEdit}>
                        Edit
                    </button>
                )}
                {isEditing && (
                    <div style={styles.actionBtns}>
                        <button style={styles.saveBtn} onClick={onSave} disabled={saving}>
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button style={styles.cancelBtn} onClick={onCancel} disabled={saving}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2563EB',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        margin: 0,
    },
    editBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#2563EB',
        background: 'none',
        border: '1px solid #DBEAFE',
        borderRadius: '6px',
        padding: '4px 12px',
        cursor: 'pointer',
    },
    actionBtns: {
        display: 'flex',
        gap: '8px',
    },
    saveBtn: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#2563EB',
        border: 'none',
        borderRadius: '6px',
        padding: '5px 14px',
        cursor: 'pointer',
    },
    cancelBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#6B7280',
        background: 'none',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        padding: '4px 12px',
        cursor: 'pointer',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
};

export default InfoSection;
