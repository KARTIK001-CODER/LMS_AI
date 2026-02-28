import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

const AI_REPLIES = [
    "I'm reviewing your profile now. How can I help?",
    "Great question! Let me look into that for you.",
    "Based on your profile, here's what I suggest...",
    "I can help you with that. Could you tell me more?",
    "Got it. Give me a moment to think about this.",
];

const ChatbotPanel = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hi! I\'m your AI learning assistant. Ask me anything about your profile or courses.' },
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        const text = input.trim();
        if (!text) return;

        const userMsg = { id: Date.now(), sender: 'user', text };
        const aiMsg = {
            id: Date.now() + 1,
            sender: 'ai',
            text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)],
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');

        setTimeout(() => {
            setMessages((prev) => [...prev, aiMsg]);
        }, 600);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={styles.panel}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerDot} />
                    <span style={styles.headerTitle}>AI Assistant</span>
                </div>
                <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div style={styles.messages}>
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg.text} sender={msg.sender} />
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={styles.inputArea}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Ask something…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <button
                    style={input.trim() ? styles.sendBtn : { ...styles.sendBtn, opacity: 0.4 }}
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    aria-label="Send"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const styles = {
    panel: {
        position: 'fixed',
        bottom: '90px',
        right: '24px',
        width: '350px',
        height: '72vh',
        maxHeight: '560px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        animation: 'slideUp 0.2s ease',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #F3F4F6',
        flexShrink: 0,
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    headerDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#22C55E',
        boxShadow: '0 0 0 2px rgba(34,197,94,0.2)',
    },
    headerTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#111827',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#9CA3AF',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '4px',
        fontFamily: 'inherit',
    },
    messages: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 8px',
    },
    inputArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        borderTop: '1px solid #F3F4F6',
        flexShrink: 0,
    },
    input: {
        flex: 1,
        padding: '10px 14px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#111827',
        outline: 'none',
        fontFamily: 'inherit',
        backgroundColor: '#F9FAFB',
    },
    sendBtn: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        backgroundColor: '#2563EB',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'opacity 0.15s',
        fontFamily: 'inherit',
    },
};

export default ChatbotPanel;
