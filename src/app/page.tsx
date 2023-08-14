'use client'

import { useState } from 'react';

// TODO: 画面上部の日付と同期させた監視対象日のデータをPOSTする。（バックエンド実行後）
// TODO: anyの部分を型定義する

export default function MyForm() {
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

  // textarea の入力値を管理する state
  const [reportItems, setReportItems] = useState({
    example1: '',
    example2: '',
    example3: '',
    example4: '',
    example5: '',
  });

  const submitData = async () => {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + 9 * 60 * 60 * 1000);
    const isoString = currentDate.toISOString();

    const rows = [
      { target_name: "パチンコビスタ", target_ip: "192.168.20.32", is_working: String(checkboxes.example1.visual), is_backup_completed: String(checkboxes.example1.backup), is_not_alert: String(checkboxes.example1.zabbix), created_at: isoString, updated_at: isoString },
      { target_name: "券売機", target_ip: "192.168.20.32", is_working: String(checkboxes.example2.visual), is_backup_completed: String(checkboxes.example2.backup), is_not_alert: String(checkboxes.example2.zabbix), created_at: isoString, updated_at: isoString },
      { target_name: "エフ・エス", target_ip: "192.168.20.32", is_working: String(checkboxes.example3.visual), is_backup_completed: String(checkboxes.example3.backup), is_not_alert: String(checkboxes.example3.zabbix), created_at: isoString, updated_at: isoString },
      { target_name: "グループセッション", target_ip: "192.168.20.32", is_working: String(checkboxes.example4.visual), is_backup_completed: String(checkboxes.example4.backup), is_not_alert: String(checkboxes.example4.zabbix), created_at: isoString, updated_at: isoString },
      { target_name: "券売機プロ", target_ip: "192.168.20.32", is_working: String(checkboxes.example5.visual), is_backup_completed: String(checkboxes.example5.backup), is_not_alert: String(checkboxes.example5.zabbix), created_at: isoString, updated_at: isoString },
    ];

    // ローカルストレージからaccess_tokenを取得
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("No access token found in local storage");
      return;
    }

    // x-www-form-urlencoded形式でエンコードする関数
    const formUrlEncode = (obj) => Object.keys(obj)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
      .join('&');

    // 各行のデータを1件ずつPOSTする
    for (const payload of rows) {
      console.log(payload);
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
    <div>
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
            <th>報告事項</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>パチンコビスタ</td>
            <td><input type="checkbox" checked={checkboxes.example1.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example1: { ...prev.example1, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example1.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example1: { ...prev.example1, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example1.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example1: { ...prev.example1, backup: e.target.checked } }))} /></td>
            <td><textarea value={reportItems.example1} onChange={(e) => setReportItems(prev => ({ ...prev, example1: e.target.value }))} /></td>
          </tr>
          <tr>
            <td>券売機</td>
            <td><input type="checkbox" checked={checkboxes.example2.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, backup: e.target.checked } }))} /></td>
            <td><textarea value={reportItems.example2} onChange={(e) => setReportItems(prev => ({ ...prev, example2: e.target.value }))} /></td>
          </tr>
          <tr>
            <td>エフ・エス</td>
            <td><input type="checkbox" checked={checkboxes.example3.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example3: { ...prev.example3, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example3.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example3: { ...prev.example3, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example3.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example3: { ...prev.example3, backup: e.target.checked } }))} /></td>
            <td><textarea value={reportItems.example3} onChange={(e) => setReportItems(prev => ({ ...prev, example3: e.target.value }))} /></td>
          </tr>
          <tr>
            <td>グループセッション</td>
            <td><input type="checkbox" checked={checkboxes.example4.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example4: { ...prev.example4, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example4.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example4: { ...prev.example4, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example4.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example4: { ...prev.example4, backup: e.target.checked } }))} /></td>
            <td><textarea value={reportItems.example4} onChange={(e) => setReportItems(prev => ({ ...prev, example4: e.target.value }))} /></td>
          </tr>
          <tr>
            <td>券売機プロ</td>
            <td><input type="checkbox" checked={checkboxes.example5.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example5: { ...prev.example5, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example5.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example5: { ...prev.example5, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example5.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example5: { ...prev.example5, backup: e.target.checked } }))} /></td>
            <td><textarea value={reportItems.example5} onChange={(e) => setReportItems(prev => ({ ...prev, example5: e.target.value }))} /></td>
          </tr>
        </tbody>
      </table>
      <style jsx>{`
              .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 20px;
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
              
              th:nth-child(5), td:nth-child(5) {  // 5番目のセルに適用
                width: 50%;  // 必要に応じて値を調整してください
              }
              
              textarea {
                width: 100%;
                height: 100%;
                padding: 5px; 
                border: 1px solid #ccc;
                box-sizing: border-box;
                resize: none;  // ユーザーがテキストエリアのサイズを変更しないようにする
              }
              input[type="checkbox"] {
                transform: scale(2.5);
                margin: 5px;
              }
            `}</style>
    </div>
  );
}
