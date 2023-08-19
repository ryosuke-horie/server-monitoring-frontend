import { useState, useEffect } from "react";
import { MONITORING_TARGETS } from "../monitoring-config";

export function useMonitoringData(initialDate) {
  const [accessToken, setAccessToken] = useState(null);
  const [date, setDate] = useState(initialDate);
  // データが登録済みかどうかの状態を管理
  const [isDataRegistered, setIsDataRegistered] = useState(false);

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

  const selectAllCheckboxes = () => {
    const allSelectedCheckboxes = MONITORING_TARGETS.reduce((acc, target) => {
      acc[target.key] = { visual: true, zabbix: true, backup: true };
      return acc;
    }, {});
    setCheckboxes(allSelectedCheckboxes);
  };

  return {
    accessToken,
    date,
    setDate,
    checkboxes,
    selectAllCheckboxes,
    setCheckboxes,
    isDataRegistered,
  };

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

      // データが存在する場合に isDataRegistered を true に設定
      if (data && data.length > 0) {
        setIsDataRegistered(true);
      } else {
        setIsDataRegistered(false);
      }

      const updatedCheckboxes = MONITORING_TARGETS.reduce((acc, target) => {
        const fetchedItem = data.find(
          (item) => item.target_name === target.name
        );
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
}
