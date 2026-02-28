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
            <span style={styles.navBrand}>
                <span style={styles.navBrandAccent}>AI</span> LMS
            </span>
            <button
                style={styles.logoutBtn}
                onClick={handleLogout}
                onMouseEnter={e => { e.target.style.color = "#111827"; e.target.style.borderColor = "#9CA3AF"; }}
                onMouseLeave={e => { e.target.style.color = "#6B7280"; e.target.style.borderColor = "#E5E7EB"; }}
            >
                Log out
            </button>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 24px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
    },
    navBrand: {
        fontSize: "15px",
        fontWeight: "700",
        letterSpacing: "-0.3px",
        color: "#111827",
    },
    navBrandAccent: {
        color: "#2563EB",
    },
    logoutBtn: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#6B7280",
        background: "none",
        border: "1px solid #E5E7EB",
        borderRadius: "7px",
        padding: "6px 14px",
        cursor: "pointer",
        transition: "color 0.15s, border-color 0.15s",
    },
};

export default Navbar;
