'use client'

import { useState } from 'react';

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

  return (
    <div>
      <div className="header">
        <button onClick={decrementDate}>＜</button>
        <span className="date-header">{date}</span>
        <button onClick={incrementDate}>＞</button>
        <button onClick={selectAll}>全選択</button>
        <button>送信</button>
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
            <td><textarea /></td>
          </tr>
          <tr>
            <td>券売機</td>
            <td><input type="checkbox" checked={checkboxes.example2.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, backup: e.target.checked } }))} /></td>
            <td><textarea /></td>
          </tr>
          <tr>
            <td>エフ・エス</td>
            <td><input type="checkbox" checked={checkboxes.example2.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, backup: e.target.checked } }))} /></td>
            <td><textarea /></td>
          </tr>
          <tr>
            <td>グループセッション</td>
            <td><input type="checkbox" checked={checkboxes.example2.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, backup: e.target.checked } }))} /></td>
            <td><textarea /></td>
          </tr>
          <tr>
            <td>券売機プロ</td>
            <td><input type="checkbox" checked={checkboxes.example2.visual} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, visual: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.zabbix} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, zabbix: e.target.checked } }))} /></td>
            <td><input type="checkbox" checked={checkboxes.example2.backup} onChange={(e) => setCheckboxes(prev => ({ ...prev, example2: { ...prev.example2, backup: e.target.checked } }))} /></td>
            <td><textarea /></td>
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
