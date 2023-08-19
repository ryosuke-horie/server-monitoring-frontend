import React from 'react';
import styles from './tableRow.module.css';

const TableRow = ({ siteName, checkboxData, setCheckboxes }) => {
    return (
        <tr>
            <td className={styles.tableCell}>{siteName}</td>
            <td className={styles.tableCell}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checkboxData.visual}
                    onChange={(e) => setCheckboxes(prev => ({ ...prev, [siteName]: { ...prev[siteName], visual: e.target.checked } }))}
                />
            </td>
            <td className={styles.tableCell}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checkboxData.zabbix}
                    onChange={(e) => setCheckboxes(prev => ({ ...prev, [siteName]: { ...prev[siteName], zabbix: e.target.checked } }))}
                />
            </td>
            <td className={styles.tableCell}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checkboxData.backup}
                    onChange={(e) => setCheckboxes(prev => ({ ...prev, [siteName]: { ...prev[siteName], backup: e.target.checked } }))}
                />
            </td>
        </tr>
    );
};

export default TableRow;
