import { useState, useEffect } from "react";
import { MONITORING_TARGETS } from "../monitoring-config";

async function fetchInitialCheckboxValues(date, setCheckboxes, token) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/monitoring?date=${date}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    const updatedCheckboxes = MONITORING_TARGETS.reduce((acc, target) => {
      const fetchedItem = data.find((item) => item.target_name === target.name);
      if (fetchedItem) {
        acc[target.key] = {
          visual: fetchedItem.is_working === "true",
          zabbix: fetchedItem.is_not_alert === "true",
          backup: fetchedItem.is_backup_completed === "true",
        };
      } else {
        acc[target.key] = { visual: false, zabbix: false, backup: false };
      }
      return acc;
    }, {});

    setCheckboxes(updatedCheckboxes);
  } catch (error) {
    console.error("Error fetching initial checkbox values:", error);
  }
}

export function useMonitoringData(initialDate) {
  const [accessToken, setAccessToken] = useState(null);
  const [date, setDate] = useState(initialDate);

  const initialCheckboxes = MONITORING_TARGETS.reduce((acc, target) => {
    acc[target.key] = { visual: false, zabbix: false, backup: false };
    return acc;
  }, {});

  const [checkboxes, setCheckboxes] = useState(initialCheckboxes);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      fetchInitialCheckboxValues(date, setCheckboxes, token);
    } else {
      window.location.href = "/signin";
    }
  }, [date]);

  return { accessToken, date, setDate, checkboxes, setCheckboxes };
}
