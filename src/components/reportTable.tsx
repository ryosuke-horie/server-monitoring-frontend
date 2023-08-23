import React, { useState } from 'react';

type ServerRecord = {
  is_backup_completed: boolean;
  is_not_alert: boolean;
  is_working: boolean;
  record_date: string;
  user: {
    username: string;
  };
};

type ServerData = {
  [serverName: string]: ServerRecord[];
};

interface DataTableProps {
  data: ServerData;
}

// 文字列の "true" を true に、"false" を false に変換するヘルパー関数
const stringToBoolean = (str) => str === "true";

export default function ReportTable({ data }: DataTableProps) {
  // 各サーバーの表示状態を管理するステート
  const [shownServer, setShownServer] = useState<string | null>(null);

  if (!data) return <div>No data available.</div>;

  // サーバー名をトグルする関数
  const toggleServer = (serverName: string) => {
    if (shownServer === serverName) {
      setShownServer(null);
    } else {
      setShownServer(serverName);
    }
  };

  return (
    <>
      <div>
        {Object.entries(data).map(([server, records]) => (
          <div key={server}>
            <div className="header">
              <h2>{server}</h2>
              {records.length > 5 && (
                <button onClick={() => toggleServer(server)}>
                  {shownServer === server ? '表示を縮小' : 'もっと見る'}
                </button>
              )}
            </div>
            <table>
              <thead>
                <tr>
                  <th>日時</th>
                  <th>バックアップ</th>
                  <th>Zabbixアラート</th>
                  <th>目視確認</th>
                  <th>担当者</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  (shownServer === server ? records : records.slice(0, 5)).map((record, idx) => (
                    <tr key={idx}>
                      <td>{record.record_date}</td>
                      <td>{stringToBoolean(record.is_backup_completed) ? 'OK' : 'NG'}</td>
                      <td>{stringToBoolean(record.is_not_alert) ? 'OK' : 'NG'}</td>
                      <td>{stringToBoolean(record.is_working) ? 'OK' : 'NG'}</td>
                      <td>{record.user.username}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No Data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div >
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
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 5px;
    }
    .date-header {
        font-size: 1.5em;
        font-weight: bold;
        margin: 0 5px;
    }
    button {
        margin: 0 2px;
        padding: 5px 15px;
        border: none;
        background-color: #007BFF;
        color: #fff;
        border-radius: 5px;
        transition: background-color 0.3s;
    }
    button:hover {
        background-color: #0056b3;
        cursor: pointer;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background-color: #007BFF;
      color: white;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }
    tbody tr:nth-child(odd) {
      background-color: #f5f5f5;
    }
    input[type="checkbox"] {
      transform: scale(1.5);
      margin: 5px;
    }
  `}</style>
    </>
  );
}
