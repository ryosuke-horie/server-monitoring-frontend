'use client'

import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import TableRow from '../components/TableRow';

// 監視対象サービスのリスト。
const MONITORING_TARGETS = [
  { key: 'example1', name: 'パチンコビスタ', ip: '192.168.20.32' },
  { key: 'example2', name: '券売機', ip: '192.168.20.32' },
  { key: 'example3', name: 'エフエス', ip: '192.168.20.32' },
  { key: 'example4', name: 'グループセッション', ip: '192.168.20.32' },
  { key: 'example5', name: '券売機プロ', ip: '192.168.20.32' },
];

// 監視用のチェックボックスの型定義
type CheckboxType = {
  visual: boolean;
  zabbix: boolean;
  backup: boolean;
};

async function fetchInitialCheckboxValues(date, setCheckboxes, token) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/monitoring?date=${date}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    const updatedCheckboxes = MONITORING_TARGETS.reduce((acc, target) => {
      const fetchedItem = data.find(item => item.target_name === target.name);
      if (fetchedItem) {
        acc[target.key] = {
          visual: fetchedItem.is_working === "true",
          zabbix: fetchedItem.is_not_alert === "true",
          backup: fetchedItem.is_backup_completed === "true"
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

function formatDate(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

function adjustDate(currentDate, days) {
  const adjustedDate = new Date(currentDate);
  adjustedDate.setDate(currentDate.getDate() + days);
  return formatDate(adjustedDate);
}

function createPayload(checkboxes, date) {
  const currentDate = new Date();
  currentDate.setTime(currentDate.getTime() + 9 * 60 * 60 * 1000);
  const isoString = currentDate.toISOString();

  return MONITORING_TARGETS.map(target => ({
    target_name: target.name,
    target_ip: target.ip,
    is_working: checkboxes[target.key].visual,
    is_backup_completed: checkboxes[target.key].backup,
    is_not_alert: checkboxes[target.key].zabbix,
    created_at: isoString,
    updated_at: isoString,
    record_date: date
  }));
}

async function sendData(payloads, accessToken) {
  const formUrlEncode = (obj) => Object.keys(obj)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k] === true ? "true" : obj[k] === false ? "false" : obj[k])}`)
    .join('&');

  for (const payload of payloads) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/monitoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${accessToken}`
        },
        body: formUrlEncode(payload)
      });

      if (response.status !== 201) {
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
}

export default function MonitoringForm() {
  // アクセストークンをstateとして管理
  const [accessToken, setAccessToken] = useState(null);

  // 現在時刻を取得してフォーマットする。：2023/01/01
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
  const [date, setDate] = useState(formattedDate);

  // 2. initialCheckboxesのデフォルト値を設定
  const initialCheckboxes = MONITORING_TARGETS.reduce((acc, target) => {
    acc[target.key] = { visual: false, zabbix: false, backup: false };
    return acc;
  }, {});
  const [checkboxes, setCheckboxes] = useState<Record<string, CheckboxType>>(initialCheckboxes);


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      fetchInitialCheckboxValues(date, setCheckboxes, token);
    } else {
      window.location.href = '/signin';
    }  }, [date]);

  const incrementDate = () => {
    setDate(prevDate => adjustDate(new Date(prevDate), 1));
  }

  const decrementDate = () => {
    setDate(prevDate => adjustDate(new Date(prevDate), -1));
  }

  const selectAll = () => {
    const allSelectedCheckboxes = Object.keys(checkboxes).reduce((acc, key) => {
      acc[key] = { visual: true, zabbix: true, backup: true };
      return acc;
    }, {});
    setCheckboxes(allSelectedCheckboxes);
  }

  const submitData = async () => {
    const payloads = createPayload(checkboxes, date);
    await sendData(payloads, accessToken);
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
          {MONITORING_TARGETS.map(target => (
            <TableRow
              key={target.key}
              siteName={target.name}
              checkboxData={checkboxes[target.key]}
              setCheckboxes={setCheckboxes}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
