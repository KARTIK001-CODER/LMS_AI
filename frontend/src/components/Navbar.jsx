import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <span style={styles.appName}>AI‑LMS</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #F3F4F6',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    appName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827',
        letterSpacing: '-0.2px',
    },
    logoutBtn: {
        background: 'none',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        padding: '6px 14px',
        fontSize: '13px',
        color: '#6B7280',
        cursor: 'pointer',
        fontFamily: 'inherit',
    },
};

export default Navbar;
