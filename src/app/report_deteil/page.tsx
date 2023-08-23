'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReportTable from "../../components/reportTable";

export default function ReportDetailPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [reportData, setReportData] = useState(null);

  const searchParams = useSearchParams();
  const dateYear = searchParams.get("dateYear");
  const year = dateYear.slice(0, 4);
  const month = dateYear.slice(4, 6);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);

    if (!token) {
      window.location.href = '/signin';
      return;
    }

    // Nest.jsのAPIを叩いて、当月のサーバー監視記録を取得する
    const getReportData = async () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/monthly-report/?dateYear=${dateYear}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        const data = await response.json();
        setReportData(data);

      } catch (error) {
        console.error("There was an error fetching the data", error);
      }
    };

    getReportData();
  }, [dateYear, accessToken]);

  return (
    <div style={{ margin: '0 auto', maxWidth: '1200px', padding: '0 20px' }}>
      <h1>{year}年{month}月のサーバー監視記録</h1>
      <ReportTable data={reportData} />
    </div>
  )
}

