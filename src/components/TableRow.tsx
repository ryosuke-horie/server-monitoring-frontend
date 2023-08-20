import React from 'react';
import styles from './tableRow.module.css';

const TableRow = ({ siteName, checkboxData, setCheckboxes, keyValue }) => {
    return (
        <tr>
            <td className={styles.tableCell}>{siteName}</td>
            <td className={styles.tableCell}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checkboxData.visual}
                    onChange={(e) => setCheckboxes(prev => ({ ...prev, [keyValue]: { ...prev[keyValue], visual: e.target.checked } }))}
                />
            </td>
            <td className={styles.tableCell}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checkboxData.zabbix}
                    onChange={(e) => setCheckboxes(prev => ({ ...prev, [keyValue]: { ...prev[keyValue], zabbix: e.target.checked } }))}
                />
            </td>
            <td className={styles.tableCell}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checkboxData.backup}
                    onChange={(e) => setCheckboxes(prev => ({ ...prev, [keyValue]: { ...prev[keyValue], backup: e.target.checked } }))}
                />
            </td>
        </tr>
    );
};

export default TableRow;
