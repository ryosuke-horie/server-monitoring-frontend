'use client'

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import TableRow from '../components/TableRow';

// TODO: anyの部分を型定義する
export default function MonitoringForm() {
  const [accessToken, setAccessToken] = useState(null);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;

  const [date, setDate] = useState(formattedDate);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);

    if (!token) {
      window.location.href = '/signin';
    }

    // チェックボックスの初期値を取得する関数
    const fetchInitialCheckboxValues = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/monitoring?date=${date}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        const data = await response.json();

        // フェッチしたデータを元にcheckboxes stateを更新
        const updatedCheckboxes = { ...checkboxes }; // 現在のcheckboxesのコピー

        data.forEach(item => {
          switch (item.target_name) {
            case "パチンコビスタ":
              updatedCheckboxes.example1 = {
                visual: item.is_working === "true",
                zabbix: item.is_not_alert === "true",
                backup: item.is_backup_completed === "true"
              };
              break;
            case "券売機":
              updatedCheckboxes.example2 = {
                visual: item.is_working === "true",
                zabbix: item.is_not_alert === "true",
                backup: item.is_backup_completed === "true"
              };
            case "エフエス":
              updatedCheckboxes.example3 = {
                visual: item.is_working === "true",
                zabbix: item.is_not_alert === "true",
                backup: item.is_backup_completed === "true"
              };
              break;
            case "グループセッション":
              updatedCheckboxes.example4 = {
                visual: item.is_working === "true",
                zabbix: item.is_not_alert === "true",
                backup: item.is_backup_completed === "true"
              };
              break;
            case "券売機プロ":
              updatedCheckboxes.example5 = {
                visual: item.is_working === "true",
                zabbix: item.is_not_alert === "true",
                backup: item.is_backup_completed === "true"
              };
              break;
            default:
              break;
          }
        });

        setCheckboxes(updatedCheckboxes);
      } catch (error) {
        console.error("Error fetching initial checkbox values:", error);
      }
    };

    fetchInitialCheckboxValues(); // 関数の実行
  }, []);

  // 日付を1日進める関数
  const incrementDate = () => {
    let [year, month, day] = date.split('/').map(Number);
    const nextDate = new Date(year, month - 1, day + 1);
    setDate(`${nextDate.getFullYear()}/${String(nextDate.getMonth() + 1).padStart(2, '0')}/${String(nextDate.getDate()).padStart(2, '0')}`);
  }

  // 日付を1日戻す関数
  const decrementDate = () => {
    let [year, month, day] = date.split('/').map(Number);
    const prevDate = new Date(year, month - 1, day - 1);
    setDate(`${prevDate.getFullYear()}/${String(prevDate.getMonth() + 1).padStart(2, '0')}/${String(prevDate.getDate()).padStart(2, '0')}`);
  }

  // 各チェックボックスの選択状態を管理する state
  const [checkboxes, setCheckboxes] = useState({
    example1: { visual: false, zabbix: false, backup: false },
    example2: { visual: false, zabbix: false, backup: false },
    example3: { visual: false, zabbix: false, backup: false },
    example4: { visual: false, zabbix: false, backup: false },
    example5: { visual: false, zabbix: false, backup: false },
  });

  type CheckboxType = {
    visual: boolean;
    zabbix: boolean;
    backup: boolean;
  };

  const selectAll = () => {
    const updatedCheckboxes: { [key in keyof typeof checkboxes]: CheckboxType } = {} as any;

    for (let key in checkboxes) {
      updatedCheckboxes[key as keyof typeof checkboxes] = { visual: true, zabbix: true, backup: true };
    }

    setCheckboxes(updatedCheckboxes);
  };

  const submitData = async () => {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + 9 * 60 * 60 * 1000);
    const isoString = currentDate.toISOString();

    const rows = [
      { target_name: "パチンコビスタ", target_ip: "192.168.20.32", is_working: checkboxes.example1.visual, is_backup_completed: checkboxes.example1.backup, is_not_alert: checkboxes.example1.zabbix, created_at: isoString, updated_at: isoString, record_date: date },
      { target_name: "券売機", target_ip: "192.168.20.32", is_working: checkboxes.example2.visual, is_backup_completed: checkboxes.example2.backup, is_not_alert: checkboxes.example2.zabbix, created_at: isoString, updated_at: isoString, record_date: date },
      { target_name: "エフエス", target_ip: "192.168.20.32", is_working: checkboxes.example3.visual, is_backup_completed: checkboxes.example3.backup, is_not_alert: checkboxes.example3.zabbix, created_at: isoString, updated_at: isoString, record_date: date },
      { target_name: "グループセッション", target_ip: "192.168.20.32", is_working: checkboxes.example4.visual, is_backup_completed: checkboxes.example4.backup, is_not_alert: checkboxes.example4.zabbix, created_at: isoString, updated_at: isoString, record_date: date },
      { target_name: "券売機プロ", target_ip: "192.168.20.32", is_working: checkboxes.example5.visual, is_backup_completed: checkboxes.example5.backup, is_not_alert: checkboxes.example5.zabbix, created_at: isoString, updated_at: isoString, record_date: date },
    ];

    // x-www-form-urlencoded形式でエンコードする関数
    const formUrlEncode = (obj) => Object.keys(obj)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k] === true ? "true" : obj[k] === false ? "false" : obj[k])}`)
    .join('&');

    // 各行のデータを1件ずつPOSTする
    for (const payload of rows) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/monitoring`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`
          },
          body: formUrlEncode(payload) // bodyをエンコードする
        });

        if (response.status === 201) { // 成功時のステータスコードを201としてチェック
          const data = await response.json();
          console.log(data);
        } else {
          const errorData = await response.json();
          console.error(`Error: ${response.statusText}`);
          console.error(errorData);
          alert(`送信に失敗しました。${response.statusText}`);
        }
      } catch (error) {
        alert(`送信に失敗しました。${error}`);
        console.error("There was an error submitting the data", error);
      }
    };
    alert('送信が完了しました。');
  };

  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.header}>
        <button onClick={decrementDate}>＜</button>
        <span className={styles.dateHeader}>{date}</span>
        <button onClick={incrementDate}>＞</button>
        <button onClick={selectAll}>全選択</button>
        <button onClick={submitData}>送信</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>サイト名</th>
            <th className={styles.tableHeader}>目視確認</th>
            <th className={styles.tableHeader}>Zabbix</th>
            <th className={styles.tableHeader}>Backup</th>
          </tr>
        </thead>
        <tbody>
          <TableRow siteName="パチンコビスタ" checkboxData={checkboxes.example1} setCheckboxes={setCheckboxes} />
          <TableRow siteName="券売機" checkboxData={checkboxes.example2} setCheckboxes={setCheckboxes} />
          <TableRow siteName="券売機プロ" checkboxData={checkboxes.example3} setCheckboxes={setCheckboxes} />
          <TableRow siteName="グループセッション" checkboxData={checkboxes.example4} setCheckboxes={setCheckboxes} />
          <TableRow siteName="エフ・エス" checkboxData={checkboxes.example5} setCheckboxes={setCheckboxes} />
        </tbody>
      </table>
    </div>
  );
}
