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
    // トークンの有効性をチェック
    checkToken(token);
  }, [date]);

  // チェックボックスを全て選択する
  const selectAllCheckboxes = () => {
    const allSelectedCheckboxes = MONITORING_TARGETS.reduce((acc, target) => {
      acc[target.key] = { visual: true, zabbix: true, backup: true };
      return acc;
    }, {});
    setCheckboxes(allSelectedCheckboxes);
  };

  // チェックボックスの選択を解除する
  const deselectAllCheckboxes = () => {
    const allDeselectedCheckboxes = MONITORING_TARGETS.reduce((acc, target) => {
      acc[target.key] = { visual: false, zabbix: false, backup: false };
      return acc;
    }, {});
    setCheckboxes(allDeselectedCheckboxes);
  };

  return {
    accessToken,
    date,
    setDate,
    checkboxes,
    selectAllCheckboxes,
    deselectAllCheckboxes,
    setCheckboxes,
    isDataRegistered,
  };

  /**
   * トークンの有効性をチェックする
   * @param token
   */
  async function checkToken(token) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check-token`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // トークンが無効ならサインイン画面へリダイレクト
      if (!response.ok) {
        window.location.href = "/signin";
      }
    } catch (error) {
      // トークンが無効な場合はサインイン画面にリダイレクト
      window.location.href = "/signin";
    }
  }

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
