import Link from "next/link";

export default function ReportListPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;  // 0から11の範囲で月が返されるため、+1しています

  const startYear = 2023;
  const endYear = currentYear;
  const years = Array(endYear - startYear + 1).fill(0).map((_, i) => i + startYear);

  return (
    <>
      <h1>月別レポート</h1>
      {years.map(year => (
        <div key={year}>
          <h3>{year}年</h3>
          <ul>
            {Array.from({ length: 12 }).map((_, month) => {
              const monthStr = (month + 1).toString().padStart(2, '0');

              // 2023年7月以前のリンクを非表示にする
              if (year === 2023 && month + 1 <= 7) return null;

              return (year < currentYear || month + 1 <= currentMonth) && (
                <li key={month}>
                  <Link href={`/report_deteil/?dateYear=${year}${monthStr}`}>{month + 1}月</Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
