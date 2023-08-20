'use client'

import React from 'react';
import styles from './styles.module.css';
import TableRow from '../components/TableRow';
import { MONITORING_TARGETS } from '../monitoring-config';
import { useMonitoringData } from '../fooks/useMonitoringData';
import { adjustDate } from '../utils/dateUtils';
import { formUrlEncode } from '../utils/httpUtils';

/**
 * フォームの入力値から送信用のデータを作成する
 * @param checkboxes
 * @param date
 * @returns
 */
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

/**
 * 更新のためのデータを作成する
 * @param checkboxes
 * @param date
 * @returns
 */
function createUpdatePayload(checkboxes, date) {
  const currentDate = new Date();
  currentDate.setTime(currentDate.getTime() + 9 * 60 * 60 * 1000);
  const isoString = currentDate.toISOString();

  return MONITORING_TARGETS.map(target => ({
    target_name: target.name,
    target_ip: target.ip,
    is_working: checkboxes[target.key].visual,
    is_backup_completed: checkboxes[target.key].backup,
    is_not_alert: checkboxes[target.key].zabbix,
    updated_at: isoString,  // 更新日時だけを考慮する
    record_date: date
  }));
}

/**
 * 送信用のデータをバックエンドに送信する
 * @param payloads
 * @param accessToken
 */
async function sendData(payloads, accessToken, isDataRegistered) {
  for (const payload of payloads) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/monitoring`, {
        method: isDataRegistered ? 'PATCH' : 'POST', // データが登録済みの場合はPatch、そうでない場合はPOST
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${accessToken}`
        },
        body: formUrlEncode(payload)
      });

      if (response.status === 401) {  // Unauthorized
        alert('アクセストークンが不正です。再度サインインしてください。');
        // signin画面に遷移する
        window.location.href = "/signin";
        return;
      }

      if (response.status !== (isDataRegistered ? 200 : 201)) { // Patchの成功時は通常200を返す
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
  alert(isDataRegistered ? '更新が完了しました。' : '送信が完了しました。'); // メッセージも動的に変更
}

// 曜日を取得するためのヘルパー関数
const getDayOfWeek = (dateString) => {
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const dateObj = new Date(dateString);
  return daysOfWeek[dateObj.getDay()];
};

export default function MonitoringForm() {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
  const { accessToken, date, setDate, checkboxes, setCheckboxes, selectAllCheckboxes, isDataRegistered, deselectAllCheckboxes } = useMonitoringData(formattedDate);

  const dateWithDay = `${date} (${getDayOfWeek(date)})`;

  // 日付を進める
  const incrementDate = () => {
    setDate(prevDate => adjustDate(new Date(prevDate), 1));
  }

  // 日付を戻す
  const decrementDate = () => {
    setDate(prevDate => adjustDate(new Date(prevDate), -1));
  }

  // フォームの入力値を送信する
  const submitData = async () => {
    const payloads = isDataRegistered
      ? createUpdatePayload(checkboxes, date)
      : createPayload(checkboxes, date);
    await sendData(payloads, accessToken, isDataRegistered);
  };

  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.header}>
        <button onClick={decrementDate}>＜</button>
        <span className={styles.dateHeader}>{dateWithDay}</span>
        <button onClick={incrementDate}>＞</button>
        <button onClick={selectAllCheckboxes}>全選択</button>
        <button onClick={deselectAllCheckboxes}>解除</button>
        <button onClick={submitData}>{isDataRegistered ? '更新' : '送信'}</button>
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
              keyValue={target.key}
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
