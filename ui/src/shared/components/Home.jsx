import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Employerflipcard from "../../features/employer/components/EmployerFlipCard.jsx";
import Heroic from "../../assets/heroic.png";
import Zoompic from "../../assets/zoomman.png";
import Unemployer from "../../assets/Unemployer.png";
import heroic1 from "../../assets/heroic1.png";
import heroic2 from "../../assets/heroic2.png";
import heroic3 from "../../assets/heroic3.png";
import heroic4 from "../../assets/heroic4.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-fade";


const customerBenefits = [
    "Find workers instantly near your location.",
    "Hire verified and trusted professionals with confidence.",
    "See transparent pricing with no hidden charges.",
    "Communicate directly with workers before booking.",
    "Enjoy secure payments and real-time updates.",
];

const employerBenefits = [
    "Get more work opportunities from nearby customers.",
    "Create a professional profile in minutes.",
    "Receive local job requests and save travel time.",
    "Set your own rates and manage your availability.",
    "Build your reputation with ratings and reviews.",
    "Receive secure and timely payments.",
    "Get instant alerts when new jobs are available.",
];

const Home = () => {
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = windowWidth <= 768;
    const isTablet = windowWidth <= 1024;
    const heroImages = [heroic1, heroic2, heroic3, heroic4];
    const [currentImage, setCurrentImage] = useState(0);
const [customerHover, setCustomerHover] = useState(false);
const [employerHover, setEmployerHover] = useState(false);
    const styles = {
        page: {
            width: "100%",
            overflowX: "hidden",
            backgroundColor: "#ffffff",
            fontFamily: "Arial, sans-serif",
        },
hero: {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  padding: "0 80px",

backgroundImage: `
  linear-gradient(
    to right,
    rgba(255,255,255,0.55) 0%,
    rgba(255,255,255,0.30) 35%,
    rgba(255,255,255,0) 100%
  ),
  url(${heroImages[currentImage]})
`,

 backgroundSize: "contain",
  backgroundPosition: "right center",
  backgroundRepeat: "no-repeat",
ttransition: "all 0.8s ease",
},

        heroTitle: {
            fontSize: isMobile ? "30px" : isTablet ? "38px" : "46px",
            fontWeight: "800",
            lineHeight: 1.2,
            color: "#111827",
            margin: 0,
            marginBottom: "24px",
        },
        sliderDots: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
},

dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "0.3s",
},

        highlight: {
            color: "#1976d2",
        },

        heroImageWrap: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },

        heroImage: {
            width: "100%",
            maxWidth: isMobile ? "300px" : "420px",
            height: "auto",
            objectFit: "contain",
        },

        serviceSection: {
            textAlign: "center",
            padding: isMobile ? "36px 16px 24px" : "50px 20px 30px",
            background: "#ffffff",
        },

        serviceTitle: {
            fontSize: isMobile ? "25px" : isTablet ? "30px" : "34px",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "12px",
        },

        serviceText: {
            maxWidth: "760px",
            margin: "0 auto",
            color: "#64748b",
            fontSize: isMobile ? "14px" : "16px",
            lineHeight: 1.7,
        },

        lastSection: {
            marginTop: "20px",
            width: "100%",
        },

        topBlueSection: {
            background: "linear-gradient(90deg, #0f3d91 0%, #0b4ed8 100%)",
            padding: isMobile ? "40px 20px" : isTablet ? "55px 35px" : "70px 70px 75px",
        },

        contentRow: {
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: isMobile ? "28px" : "60px",
        },

        textBlockTop: {
            flex: 1,
            maxWidth: isMobile ? "100%" : "520px",
        },

        lastTitleWhite: {
            color: "#ffffff",
            fontSize: isMobile ? "25px" : isTablet ? "30px" : "34px",
            fontWeight: 800,
            marginBottom: "16px",
            lineHeight: 1.2,
        },

        imagePlaceholder: {
            width: isMobile ? "100%" : "220px",
            maxWidth: isMobile ? "320px" : "220px",
            height: isMobile ? "150px" : "160px",
            backgroundColor: "#d9d9d9",
            borderRadius: "16px",
            flexShrink: 0,
        },

        bottomLightSection: {
            position: "relative",
            backgroundColor: "#efefef",
            padding: isMobile ? "42px 20px 90px" : isTablet ? "55px 35px 120px" : "60px 70px 140px",
            overflow: "hidden",
        },

        contentRowBottom: {
            position: "relative",
            zIndex: 2,
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: isMobile ? "28px" : "60px",
        },

        textBlockBottom: {
            flex: 1,
            maxWidth: isMobile ? "100%" : "520px",
        },

        lastTitleDark: {
            color: "#1f1f1f",
            fontSize: isMobile ? "25px" : isTablet ? "30px" : "34px",
            fontWeight: "800",
            marginBottom: "16px",
            lineHeight: 1.2,
        },

        benefitListLight: {
            margin: 0,
            paddingLeft: "20px",
            color: "#e5edff",
            fontSize: isMobile ? "14px" : "16px",
            lineHeight: 1.8,
        },

        benefitListDark: {
            margin: 0,
            paddingLeft: "20px",
            color: "#3f3f46",
            fontSize: isMobile ? "14px" : "16px",
            lineHeight: 1.8,
        },

        curveBg: {
            position: "absolute",
            left: "-10%",
            bottom: isMobile ? "-55px" : "-120px",
            width: "120%",
            height: isMobile ? "130px" : "260px",
            backgroundColor: "#e6eaf2",
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "50%",
            zIndex: 1,
        },

        bigBrandText: {
            position: "absolute",
            bottom: isMobile ? "22px" : "24px",
            left: "50%",
            transform: "translateX(-50%)",
            margin: 0,
            fontSize: isMobile ? "34px" : isTablet ? "60px" : "92px",
            fontWeight: 800,
            color: "#b7c3d9",
            zIndex: 2,
            textTransform: "capitalize",
            whiteSpace: "nowrap",
            letterSpacing: "1px",
            lineHeight: 1,
        },
    };

    useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  }, 3000);

  return () => clearInterval(interval);
}, []);

    return (
        <div style={styles.page}>
     <Header />

<Header />

<section id="hero" style={styles.hero}>
    <div
        style={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }}
    >
        <h1 style={styles.heroTitle}>
            Connect with Trusted Skilled
            <br />
            <span style={styles.highlight}>Workers</span> Near You
        </h1>

        <div
            style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginTop: "10px",
            }}
        >
            <button
                onClick={() => navigate("/customer/register")}
                onMouseEnter={() => setCustomerHover(true)}
                onMouseLeave={() => setCustomerHover(false)}
                style={{
                    background: customerHover ? "#1565c0" : "#1976d2",
                    color: "#fff",
                    border: "none",
                    padding: "14px 28px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    transform: customerHover
                        ? "translateY(-3px)"
                        : "translateY(0)",
                    boxShadow: customerHover
                        ? "0 8px 20px rgba(25,118,210,0.3)"
                        : "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                }}
            >
                Customer Registration
            </button>

            <button
                onClick={() => navigate("/employer/register")}
                onMouseEnter={() => setEmployerHover(true)}
                onMouseLeave={() => setEmployerHover(false)}
                style={{
                    background: employerHover ? "#e3f2fd" : "#fff",
                    color: "#1976d2",
                    border: "1px solid #1976d2",
                    padding: "14px 28px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    transform: employerHover
                        ? "translateY(-3px)"
                        : "translateY(0)",
                    boxShadow: employerHover
                        ? "0 8px 20px rgba(25,118,210,0.15)"
                        : "0 4px 10px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                }}
            >
                Employer Registration
            </button>
        </div>
    </div>
</section>

          <section id="services" style={styles.serviceSection}>
    <h2 style={styles.serviceTitle}>
        Quality home services at your doorstep
    </h2>
    <p style={styles.serviceText}>
        We connect you with trusted and skilled professionals for everyday
        home service needs. Simple, reliable, and professional.
    </p>
</section>

            <Employerflipcard />

            <section style={styles.lastSection}>
                <div style={styles.topBlueSection}>
                    <div style={styles.contentRow}>
                        <div style={styles.textBlockTop}>
                            <h2 style={styles.lastTitleWhite}>
                                Why Customers Choose Blue Connect?
                            </h2>
                            <ul style={styles.benefitListLight}>
                                {customerBenefits.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <img src={Zoompic} />
                    </div>
                </div>

                <div style={styles.bottomLightSection}>
                    <div style={styles.curveBg}></div>

                    <div style={styles.contentRowBottom}>
                        <div >
                            <img src={Unemployer} />
                        </div>

                        <div style={styles.textBlockBottom}>
                            <h2 style={styles.lastTitleDark}>
                                Why Join Blue Connect as a Worker?
                            </h2>
                            <ul style={styles.benefitListDark}>
                                {employerBenefits.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
                <Footer />
            </section>


        </div>
    );
};

export default Home;