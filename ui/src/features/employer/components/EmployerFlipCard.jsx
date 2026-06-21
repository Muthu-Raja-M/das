import React, { useEffect, useState } from "react";

import driverpic from "../../../assets/driverpic.png";
import masonpic from "../../../assets/masonpic.png";
import electricianpic from "../../../assets/electricianpic.png";
import plumberpic from "../../../assets/plumberpic.png";
import gardernerpic from "../../../assets/gardernerpic.png";
import painterpic from "../../../assets/painterpic.png";
import homecleaning from "../../../assets/homecleaning.png";
import carwasherpic from "../../../assets/carwasherpic.png";
import carpenterpic from "../../../assets/carpenterpic.png";
import carmechanic from "../../../assets/carmechanic.png";
import bikemechanic from "../../../assets/bikemechanic.png";
import welderpic from "../../../assets/welderpic.png";
import zoom from "../../../assets/zoomman.png";

export default function Employerflipcard() {
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = windowWidth <= 768;
    const isTablet = windowWidth <= 1024;

    const workers = [
        {
            name: "Driver",
            image: driverpic,
            description:
                "Safe and reliable transport service for personal and office travel needs.",
        },
        {
            name: "Mason",
            image: masonpic,
            description:
                "Professional masonry work for construction, flooring, and renovation.",
        },
        {
            name: "Electrician",
            image: electricianpic,
            description:
                "Electrical wiring, repair, and installation services for homes and offices.",
        },
        {
            name: "Plumber",
            image: plumberpic,
            description:
                "Pipe fixing, leakage repair, and bathroom plumbing services.",
        },
        {
            name: "Gardener",
            image: gardernerpic,
            description:
                "Garden maintenance and outdoor beautification services.",
        },
        {
            name: "Painter",
            image: painterpic,
            description:
                "Interior and exterior painting with premium finishing.",
        },
        {
            name: "Home Cleaner",
            image: homecleaning,
            description:
                "Deep cleaning and hygiene services for homes and apartments.",
        },
        {
            name: "Car Washer",
            image: carwasherpic,
            description:
                "Professional vehicle washing and detailing services.",
        },
        {
            name: "Carpenter",
            image: carpenterpic,
            description:
                "Furniture repair and custom woodwork solutions.",
        },
        {
            name: "Car Mechanic",
            image: carmechanic,
            description:
                "Complete car maintenance and repair services.",
        },
        {
            name: "Bike Mechanic",
            image: bikemechanic,
            description:
                "Bike servicing and repair for smooth riding experience.",
        },
        {
            name: "Welder",
            image: welderpic,
            description:
                "Metal welding and fabrication services for gates and grills.",
        },
    ];

    const styles = {
        section: {
            padding: isMobile ? "35px 16px 50px" : "60px 40px",
            background: "#f8fbff",
        },

        title: {
            textAlign: "center",
            fontSize: isMobile ? "28px" : "36px",
            fontWeight: "800",
            marginBottom: "10px",
            color: "#0D47A1",
        },

        subTitle: {
            textAlign: "center",
            color: "#64748b",
            fontSize: "15px",
            marginBottom: "45px",
        },

        grid: {
            display: "grid",
            gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
            gap: "60px",
            maxWidth: "1180px",
            margin: "0 auto",
        },

        card: {
            perspective: "1000px",
            height: "370px",
            cursor: "pointer",
        },

        inner: (isFlipped) => ({
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.8s ease",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }),

        front: {
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "#ffffff",
            borderRadius: "24px",
            overflow: "hidden",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "0 12px 35px rgba(25,118,210,0.14)",
            textAlign: "center",
            padding: "8px",
            boxSizing: "border-box",
            transition: "0.3s ease",
        },

        back: {
            position: "absolute",
            width: "100%",
            height: "100%",
            background:
                "linear-gradient(135deg, #1976D2, #0D47A1)",
            borderRadius: "24px",
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px",
            textAlign: "center",
            boxSizing: "border-box",
            boxShadow: "0 12px 35px rgba(25,118,210,0.25)",
        },

        image: {
            width: "100%",
            height: "270px",
            objectFit: "cover",
            borderRadius: "18px",
            display: "block",
        },

        name: {
            marginTop: "18px",
            fontSize: "21px",
            fontWeight: "700",
            color: "#0D47A1",
        },

        tapHint: {
            display: "block",
            marginTop: "8px",
            color: "#1976D2",
            fontSize: "13px",
            fontWeight: "600",
        },

        backTitle: {
            marginBottom: "16px",
            fontSize: "24px",
            fontWeight: "800",
            color: "#ffffff",
        },

        desc: {
            fontSize: "15px",
            lineHeight: 1.8,
            color: "#E3F2FD",
        },

        tapBack: {
            marginTop: "16px",
            fontSize: "12px",
            color: "#BBDEFB",
        },
    };

    return (
        <section style={styles.section}>
            <h2 style={styles.title}>Our Skilled Workers</h2>

            <p style={styles.subTitle}>
                {isMobile
                    ? "Tap each card to view service details"
                    : "Hover each card to view service details"}
            </p>

            <div style={styles.grid}>
                {workers.map((worker, index) => (
                    <div
                        key={index}
                        style={styles.card}
                        onMouseEnter={() =>
                            !isMobile && setFlippedIndex(index)
                        }
                        onMouseLeave={() =>
                            !isMobile && setFlippedIndex(null)
                        }
                        onClick={() =>
                            isMobile &&
                            setFlippedIndex(
                                flippedIndex === index ? null : index
                            )
                        }
                    >
                        <div style={styles.inner(flippedIndex === index)}>
                            <div style={styles.front}>
                                <img
                                    src={worker.image}
                                    alt={worker.name}
                                    style={styles.image}
                                />

                                <h3 style={styles.name}>
                                    {worker.name}
                                </h3>

                                {isMobile && (
                                    <span style={styles.tapHint}>
                                        Tap to see details
                                    </span>
                                )}
                            </div>

                            <div style={styles.back}>
                                <h3 style={styles.backTitle}>
                                    {worker.name}
                                </h3>

                                <p style={styles.desc}>
                                    {worker.description}
                                </p>

                                {isMobile && (
                                    <p style={styles.tapBack}>
                                        Tap again to go back
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}