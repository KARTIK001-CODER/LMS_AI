import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { sendChatMessage } from '../services/chatService';
import { getToken } from '../services/authService';

const ChatbotPanel = ({ onClose, onUpdate }) => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hi! I\'m your AI learning assistant. Ask me anything about your profile or courses.' },
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const isSendingRef = useRef(false);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || isSendingRef.current) return;

        isSendingRef.current = true;
        const userMsg = { id: Date.now(), sender: 'user', text };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const token = getToken();
            const response = await sendChatMessage(token, text);

            const replyText = response.reply || 'Sorry, I did not understand that.';
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: replyText,
            };
            setMessages((prev) => [...prev, aiMsg]);
            if (
                replyText.toLowerCase().includes('successfully') ||
                replyText.toLowerCase().includes('updated') ||
                replyText.toLowerCase().includes('saved')
            ) {
                onUpdate?.();
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: 'Sorry, I am having trouble connecting to the server.',
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
            isSendingRef.current = false;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading) {
                sendMessage();
            }
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
                {isLoading && (
                    <div style={{ padding: '8px 16px', color: '#6B7280', fontSize: '14px', fontStyle: 'italic' }}>
                        Thinking...
                    </div>
                )}
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
                    style={input.trim() && !isLoading ? styles.sendBtn : { ...styles.sendBtn, opacity: 0.4 }}
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
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
