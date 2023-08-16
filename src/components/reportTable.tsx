import React from 'react';

type ServerRecord = {
    is_backup_completed: boolean;
    is_not_alert: boolean;
    is_working: boolean;
    record_date: string;
    userId: string;
  };
  
  type ServerData = {
    [serverName: string]: ServerRecord[];
  };

  interface DataTableProps {
    data: ServerData;
  }
  

// 前提として、データは以下の形式でpropsとして渡される
// data = {
//   エフエス: [],
//   グループセッション: [{...}, {...}],
//   ...
// }

export default function ReportTable({ data }: DataTableProps) {
  if (!data) return <div>No data available.</div>;

  return (
    <>
    <div>
      {Object.entries(data).map(([server, records]) => (
        <div key={server}>
          <h2>{server}</h2>
          <table>
            <thead>
              <tr>
                <th>Backup Completed</th>
                <th>Not Alert</th>
                <th>Working</th>
                <th>Record Date</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((record, idx) => (
                  <tr key={idx}>
                    <td>{record.is_backup_completed ? 'Yes' : 'No'}</td>
                    <td>{record.is_not_alert ? 'Yes' : 'No'}</td>
                    <td>{record.is_working ? 'Yes' : 'No'}</td>
                    <td>{record.record_date}</td>
                    <td>{record.userId}</td>
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
    </div>
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
