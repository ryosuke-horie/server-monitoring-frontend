import Link from "next/link";

export default function ReportListPage() {
  return (
    <>
      <h1>月別レポート</h1>
      <h3>2023年</h3>
        <ul>
            <li><Link href="/report_deteil/?dateYear=202308">8月</Link></li>
        </ul>
    </>
  )
}