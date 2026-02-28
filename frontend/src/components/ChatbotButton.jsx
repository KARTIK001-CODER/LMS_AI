import React, { useState } from 'react';
import ChatbotPanel from './ChatbotPanel';

const ChatbotButton = ({ onUpdate }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Inject slide-up keyframe once */}
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            {open && <ChatbotPanel onClose={() => setOpen(false)} onUpdate={onUpdate} />}

            <button
                style={styles.button}
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? 'Close AI Assistant' : 'Open AI Assistant'}
            >
                {open ? (
                    /* X icon when open */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    /* Chat bubble icon when closed */
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>
        </>
    );
};

const styles = {
    button: {
        position: 'fixed',
        bottom: '28px',
        right: '24px',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        backgroundColor: '#2563EB',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
        zIndex: 1001,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        fontFamily: 'inherit',
    },
};

export default ChatbotButton;
