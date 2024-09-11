import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import OpenJiraButton from '../components/OpenJiraButton'; // Button component import
import '../components/ReportsTable.css'; // CSS import

const ReportsTable = ({ reports }) => {
  // Function to determine the text style for the result
  const getResultStyle = (result) => {
    switch (result) {
      case 'Success':
        return { color: 'green', fontWeight: 'bold', fontSize: '1.1em', textShadow: '1px 1px 2px #000' }; 
      case 'Failure':
        return { color: 'red', fontWeight: 'bold', fontSize: '1.1em', textShadow: '1px 1px 2px #000' }; 
      default:
        return { color: 'black', fontWeight: 'normal' };
    }
  };

  // Function to determine row background color based on the result
  const getRowStyle = (result) => {
    switch (result) {
      case 'Success':
        return { backgroundColor: '#e0f7e4' }; // Soft green for success
      case 'Failure':
        return { backgroundColor: '#fddede' }; // Soft red for failure
      default:
        return { backgroundColor: 'white' }; // Default for other values
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Test</TableCell>
          <TableCell>Version Build</TableCell>
          <TableCell>Cluster</TableCell>
          <TableCell>Result</TableCell>
          <TableCell>Failure Reason</TableCell>
          <TableCell>Runtime</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>User</TableCell>
          <TableCell>Actions</TableCell> {/* New column for Jira button */}
        </TableRow>
      </TableHead>
      <TableBody>
        {reports.map((report) => (
          report.tests.map((test, index) => ( // Iterate over each test in the array
            <TableRow 
              key={`${report._id}-${index}`} 
              style={{ ...getRowStyle(report.testResults[index]), transition: 'background-color 0.3s ease' }}
              className="report-row"
            >
              <TableCell>{report._id}</TableCell>
              <TableCell>{test}</TableCell>
              <TableCell>{report.version}</TableCell>
              <TableCell>{report.cluster.$oid}</TableCell>
              <TableCell style={getResultStyle(report.testResults[index])}>
                {report.testResults[index]}
              </TableCell>
              <TableCell style={{ color: 'red' }}>
                {report.testResults[index] === 'Failure' ? 'Failure Detected' : ''}
              </TableCell>
              <TableCell>{report.runtimeDuration}</TableCell>
              <TableCell>{new Date(report.date.$date).toLocaleDateString()}</TableCell>
              <TableCell>{report.triggeredBy}</TableCell>
              <TableCell>
                {report.testResults[index] === 'Failure' && (
                  <OpenJiraButton 
                    className="open-jira-button"
                    issueDetails={{
                      summary: `Failure in ${test}`,  // Customize summary
                      description: `Test ID: ${report._id}
                      Test Name: ${test}
                      Version Build: ${report.version}
                      Cluster: ${report.cluster.$oid}
                      Result: ${report.testResults[index]}
                      Runtime: ${report.runtimeDuration}
                      Date: ${new Date(report.date.$date).toLocaleDateString()}
                      User: ${report.triggeredBy}`
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))
        ))}
      </TableBody> 
    </Table>
  );
};

export default ReportsTable;
