import React from 'react';

const ChatMessage = ({ message, sender }) => {
    const isUser = sender === 'user';

    return (
        <div style={{ ...styles.row, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
            {!isUser && <div style={styles.aiAvatar}>AI</div>}
            <div style={isUser ? styles.userBubble : styles.aiBubble}>
                {message}
            </div>
        </div>
    );
};

const styles = {
    row: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        marginBottom: '12px',
    },
    aiAvatar: {
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        backgroundColor: '#EFF6FF',
        color: '#2563EB',
        fontSize: '10px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    userBubble: {
        maxWidth: '75%',
        padding: '10px 14px',
        borderRadius: '16px 16px 4px 16px',
        backgroundColor: '#2563EB',
        color: '#ffffff',
        fontSize: '14px',
        lineHeight: '1.5',
    },
    aiBubble: {
        maxWidth: '75%',
        padding: '10px 14px',
        borderRadius: '16px 16px 16px 4px',
        backgroundColor: '#F3F4F6',
        color: '#111827',
        fontSize: '14px',
        lineHeight: '1.5',
    },
};

export default ChatMessage;
