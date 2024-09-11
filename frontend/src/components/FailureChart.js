import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';

import '../components/FailureChart.css';

// Custom Tooltip component for displaying additional information
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="label">{`User: ${data.name}`}</p>
        <p className="desc">{`Failures: ${data.failures} out of ${data.total}`}</p>
      </div>
    );
  }

  return null;
};

const FailureChart = ({ reports }) => {
  const data = [];
  let totalTests = 0;

  // Iterate over each report and count failures per user
  reports.forEach(report => {
    // Count how many failures and total tests the user has
    report.testResults.forEach((result, index) => {
      totalTests += 1;
      const user = data.find(item => item.name === report.triggeredBy);
      
      if (user) {
        user.total += 1;
        if (result === 'Failure') {
          user.failures += 1;
        }
      } else {
        data.push({
          name: report.triggeredBy,
          failures: result === 'Failure' ? 1 : 0,
          total: 1
        });
      }
    });
  });

  return (
    <div className="failure-chart-container card">
      <div className="card-content">
        <h2 className="failure-chart-title">Users Tests Failure Analysis</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, totalTests]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="failures" fill="#dc3545" barSize={50}>
              <LabelList dataKey="failures" position="top" formatter={(value) => `${value} Failures`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FailureChart;
