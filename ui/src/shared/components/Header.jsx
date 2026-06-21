import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import CustomButton from "./ui/Button";
import Logo from "../../assets/logo.png";


const scrollToHero = () => {
    const heroSection = document.getElementById("hero");

    if (heroSection) {
        heroSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
};
const Header = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setMenuOpen(false);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const styles = {
    header: {
    position: "fixed",
    top: 0,
    left: 0,              // ✅ important
    width: "100%",       // ✅ important
    zIndex: 1000,
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    padding: isMobile ? "12px 16px" : "14px 28px",
},

        topBar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },

        leftSection: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
        },

        logo: {
            width: "60px",
            height: "55px",
            objectFit: "contain",
        },

        brand: {
            margin: 0,
            fontSize: isMobile ? "18px" : "21px",
            fontWeight: 700,
            color: "#1976d2",
        },

        desktopNav: {
            display: isMobile ? "none" : "flex",
            alignItems: "center",
            gap: "30px",
            flex: 1,
            justifyContent: "center",
        },

        navText: {
            position: "relative",
            display: "inline-block",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 600,
            color: "#334155",
            transition: "color 0.3s ease",
        },

        desktopRight: {
            display: isMobile ? "none" : "flex",
        },

        menuButton: {
            display: isMobile ? "flex" : "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "40px",
            height: "40px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#fff",
            cursor: "pointer",
        },

        bar: { 
            width: "18px",
            height: "2px",
            backgroundColor: "#374151",
            margin: "2px 0",
        },

        mobileMenuWrapper: {
            maxHeight: menuOpen ? "200px" : "0",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
        },

        mobileMenu: {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            paddingTop: "10px",
        },

        mobileLink: {
            textDecoration: "none",
            color: "#334155",
            fontSize: "14px",
            fontWeight: 600,
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#f9fafb",
            textAlign: "center",
        },

        mobileActiveLink: {
            color: "#1976d2",
            backgroundColor: "#eff6ff",
        },
    };

    const mobileLinkStyle = ({ isActive }) => ({
        ...styles.mobileLink,
        ...(isActive ? styles.mobileActiveLink : {}),
    });

    return (
        <header style={styles.header}>
            <div style={styles.topBar}>
                {/* LEFT */}
                <div style={styles.leftSection} onClick={() => navigate("/")}>
                    <img src={Logo} alt="Logo" style={styles.logo} />
                    <h2 style={styles.brand}>Blue Connect</h2>
                </div>

                {/* CENTER NAV */}
                <nav style={styles.desktopNav}>
                    {/* EMPLOYER */}
                    <NavLink to="/">
                        {({ isActive }) => (
 <span
    style={{
        ...styles.navText,
        cursor: "pointer",
    }}
    onClick={() => {
        const hero = document.getElementById("hero");
        hero?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }}
>
    Home
    <span
        className="line"
        style={{
            position: "absolute",
            left: 0,
            bottom: -4,
            width: "100%",
            height: "2px",
            backgroundColor: "#1976d2",
            transform: "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.3s ease",
        }}
    />
</span>
                        )}
                    </NavLink>

                    {/* Service */}
                    <NavLink to="/">
                        {({ isActive }) => (
 <span
    style={{
        ...styles.navText,
        color: "#334155",
        cursor: "pointer",
    }}
    onClick={() => {
        const section = document.getElementById("services");
        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }}
>
    Services
</span>
                        )}
                    </NavLink>
                    <NavLink to="/">
                        {({ isActive }) => (
                            <span
                                style={{
                                    ...styles.navText,
                                    color: isActive ? "#1976d2" : "#334155",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.querySelector(".line").style.transform = "scaleX(1)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.querySelector(".line").style.transform = "scaleX(0)";
                                    }
                                }}
                            >
                                Our Team
                                <span
                                    className="line"
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        bottom: -4,
                                        width: "100%",
                                        height: "2px",
                                        backgroundColor: "#1976d2",
                                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                                        transformOrigin: "left",
                                        transition: "transform 0.3s ease",
                                    }}
                                />
                            </span>
                        )}

                        
                    </NavLink>

                        <NavLink to="/">
                        {({ isActive }) => (
                            <span
                                style={{
                                    ...styles.navText,
                                    color: isActive ? "#1976d2" : "#334155",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.querySelector(".line").style.transform = "scaleX(1)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.querySelector(".line").style.transform = "scaleX(0)";
                                    }
                                }}
                            >
                                Contact Us
                                <span
                                    className="line"
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        bottom: -4,
                                        width: "100%",
                                        height: "2px",
                                        backgroundColor: "#1976d2",
                                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                                        transformOrigin: "left",
                                        transition: "transform 0.3s ease",
                                    }}
                                />
                            </span>
                        )}

                        
                    </NavLink>
                </nav>

                {/* RIGHT */}
                <div style={styles.desktopRight}>
                    <CustomButton text="Login" onClick={() => navigate("/login")} />
                </div>

                {/* MOBILE MENU */}
                <div style={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
                    <div style={styles.bar}></div>
                    <div style={styles.bar}></div>
                    <div style={styles.bar}></div>
                </div>
            </div>

            {/* MOBILE NAV */}
            {isMobile && (
                <div style={styles.mobileMenuWrapper}>
                    <div style={styles.mobileMenu}>
                        <NavLink
                            to="/"
                            style={mobileLinkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/"
                            style={mobileLinkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            service
                        </NavLink>
                        <NavLink
                            to="/"
                            style={mobileLinkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            Our Team
                        </NavLink>
                        <NavLink
                            to="/"
                            style={mobileLinkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            Contact Us
                        </NavLink>

                        <CustomButton
                            text="Login"
                            onClick={() => {
                                setMenuOpen(false);
                                navigate("/login");
                            }}
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;