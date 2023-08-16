'use client'

import React, { useEffect } from 'react';
import { useState } from 'react';

// TODO: anyの部分を型定義する
export default function MonitoringForm() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('accessToken');
  setAccessToken(token);

  if (!token) {
    window.location.href = '/signin';
  }
}, []);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;

  const [date, setDate] = useState(formattedDate);

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
      { target_name: "エフ・エス", target_ip: "192.168.20.32", is_working: checkboxes.example3.visual, is_backup_completed: checkboxes.example3.backup, is_not_alert: checkboxes.example3.zabbix, created_at: isoString, updated_at: isoString, record_date: date },
      { target_name: "グループセッション", target_ip: "192.168.20.32", is_working: checkboxes.example4.visual, is_backup_completed: checkboxes.example4.backup, is_not_alert:checkboxes.example4.zabbix, created_at: isoString, updated_at: isoString, record_date: date },
      { target_name: "券売機プロ", target_ip: "192.168.20.32", is_working: checkboxes.example5.visual, is_backup_completed: checkboxes.example5.backup, is_not_alert: checkboxes.example5.zabbix, created_at: isoString, updated_at: isoString, record_date: date },
    ];

    // x-www-form-urlencoded形式でエンコードする関数
    const formUrlEncode = (obj) => Object.keys(obj)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
      .join('&');

    // 各行のデータを1件ずつPOSTする
    for (const payload of rows) {
      try {
        const response = await fetch('http://54.199.212.225:3000/monitoring', {
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
        }
      } catch (error) {
        console.error("There was an error submitting the data", error);
      }
    };
  };


  return (
    <div className='body-wrapper'>
      <div className="header">
        <button onClick={decrementDate}>＜</button>
        <span className="date-header">{date}</span>
        <button onClick={incrementDate}>＞</button>
        <button onClick={selectAll}>全選択</button>
        <button onClick={submitData}>送信</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>サイト名</th>
            <th>目視確認</th>
            <th>Zabbix</th>
            <th>Backup</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>パチンコビスタ</td>
            <td><input type="checkbox" checked={checkboxes.example1.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example1: { ...prev.example1, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example1.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example1: { ...prev.example1, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example1.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example1: { ...prev.example1, backup: e.target.checked } }))} /></td>
          </tr>
          <tr>
            <td>券売機</td>
            <td><input type="checkbox" checked={checkboxes.example2.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, backup: e.target.checked } }))} /></td>
          </tr>
          <tr>
            <td>エフ・エス</td>
            <td><input type="checkbox" checked={checkboxes.example3.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example3: { ...prev.example3, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example3.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example3: { ...prev.example3, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example3.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example3: { ...prev.example3, backup: e.target.checked } }))} /></td>
          </tr>
          <tr>
            <td>グループセッション</td>
            <td><input type="checkbox" checked={checkboxes.example4.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example4: { ...prev.example4, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example4.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example4: { ...prev.example4, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example4.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example4: { ...prev.example4, backup: e.target.checked } }))} /></td>
          </tr>
          <tr>
            <td>券売機プロ</td>
            <td><input type="checkbox" checked={checkboxes.example5.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example5: { ...prev.example5, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example5.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example5: { ...prev.example5, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example5.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example5: { ...prev.example5, backup: e.target.checked } }))} /></td>
          </tr>
        </tbody>
      </table>
      <style jsx>{`
              .body-wrapper {
                margin-right: 20px;
                margin-left:20px;
              }
              .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 20px;
                  margin-top: 10px;
              }
              .date-header {
                  font-size: 1.5em;
                  font-weight: bold;
                  margin: 0 5px;
              }
              button {
                  margin: 0 2px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 2px;
                text-align: center;
              }
              input[type="checkbox"] {
                transform: scale(2.0);
                margin: 5px;
              }
            `}</style>
    </div>
  );
}
