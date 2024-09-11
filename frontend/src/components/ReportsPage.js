import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportsTable from './ReportsTable';
import ReportsChart from './ReportsChart';
import { Container } from '@mui/material';
import FailureChart from '../components/FailureChart';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const [filteredReports, setFilteredReports] = useState(null); // State to manage filtered reports

  useEffect(() => {
    axios.get('http://localhost:3000/api/reports')
      .then(response => {
        const reportsData = response.data;

        // חישוב הצלחות, כישלונות ו-unresolved על פי כל התוצאות במערך testResults של כל דו"ח
        const pass = reportsData.reduce((acc, report) => acc + report.testResults.filter(result => result === 'Success').length, 0);
        const fail = reportsData.reduce((acc, report) => acc + report.testResults.filter(result => result === 'Failure').length, 0);
        const unresolved = reportsData.reduce((acc, report) => acc + report.testResults.filter(result => result === 'Unresolved').length, 0);

        setReports(reportsData);
        setPassCount(pass);
        setFailCount(fail);
        setUnresolvedCount(unresolved);
      })
      .catch(error => console.error('Error fetching the reports:', error));
  }, []);

  const handleFilter = (status) => {
    if (status) {
      // פילטר לפי התוצאות במערך testResults של כל דו"ח
      const filtered = reports.filter(report => report.testResults.includes(status));
      setFilteredReports(filtered);
    } else {
      setFilteredReports(null); // Reset to show all reports
    }
  };

  const handlePassRateClick = () => {
    setFilteredReports(null); // Reset to show all reports
  };

  return (
    <Container maxWidth="lg">
      <ReportsChart 
        passCount={passCount} 
        failCount={failCount} 
        unresolvedCount={unresolvedCount} 
        totalTests={passCount + failCount + unresolvedCount} // מספר כולל של בדיקות
        onSegmentClick={handleFilter} // העברת הפילטר לתרשים
        onPassRateClick={handlePassRateClick} // איפוס הפילטר
        reports={reports} 
      />
      <FailureChart reports={reports} />
      <ReportsTable reports={filteredReports || reports} /> {/* הצגת הדוחות המסוננים או כל הדוחות */}
    </Container>
  );
};

export default ReportsPage;
