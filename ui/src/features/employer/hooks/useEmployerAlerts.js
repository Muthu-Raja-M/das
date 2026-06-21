import { useEffect, useState } from "react";
import { fetchEmployerAlerts } from "../../../shared/services/alertService";

export const useEmployerAlerts = (email) => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadAlerts = async () => {
        if (!email) return;

        try {
            setLoading(true);
            const data = await fetchEmployerAlerts(email);
            console.log("FETCHED ALERT DATA:", data);
            setAlerts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Load alerts error:", error);
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlerts();

        const interval = setInterval(loadAlerts, 5000);
        return () => clearInterval(interval);
    }, [email]);

    return { alerts, loading, reloadAlerts: loadAlerts };
};