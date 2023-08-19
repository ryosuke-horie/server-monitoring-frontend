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

export default function MonitoringForm() {
  // アクセストークンをstateとして管理
  const [accessToken, setAccessToken] = useState(null);

  // 現在時刻を取得してフォーマットする。：2023/01/01
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
  const [date, setDate] = useState(formattedDate);

  useEffect(() => {
    // アクセストークンをlocalStorageから取得してstateにセット
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);

    // もしアクセストークンがなければ、サインインページにリダイレクトさせる
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

  const initialCheckboxes = MONITORING_TARGETS.reduce((acc, target) => {
    acc[target.key] = { visual: false, zabbix: false, backup: false };
    return acc;
  }, {});

  const [checkboxes, setCheckboxes] = useState<Record<string, CheckboxType>>(initialCheckboxes);

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

    const rows = MONITORING_TARGETS.map(target => ({
      target_name: target.name,
      target_ip: target.ip,
      is_working: checkboxes[target.key].visual,
      is_backup_completed: checkboxes[target.key].backup,
      is_not_alert: checkboxes[target.key].zabbix,
      created_at: isoString,
      updated_at: isoString,
      record_date: date
    }));

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
