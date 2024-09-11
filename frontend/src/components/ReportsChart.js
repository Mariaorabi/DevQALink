import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Box, Typography } from '@mui/material';

const ReportsChart = ({ passCount, failCount, unresolvedCount, totalTests, onSegmentClick, onPassRateClick }) => {
  const passRate = totalTests > 0 ? ((passCount / totalTests) * 100).toFixed(0) : 0;

  // Handle the click event on the pie chart
  const handlePieClick = (entry) => {
    const status = entry.name === 'Pass' ? 'Success' : entry.name === 'Fail' ? 'Failure' : entry.name; 
    onSegmentClick(status); // Trigger filtering in the parent component
  };

  const data = [
    { name: 'Pass', value: passCount, color: '#28a745' },
    { name: 'Fail', value: failCount, color: '#dc3545' },
    { name: 'Unresolved', value: unresolvedCount, color: '#ffc107' },
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h6" component="div" gutterBottom>
        Test Results Status
      </Typography>
      <PieChart width={500} height={500}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={150}
          outerRadius={180}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          paddingAngle={5}
          onClick={handlePieClick} // Handle click on pie chart segments
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        {/* Pass rate label */}
        <text
          x={250}
          y={250}
          textAnchor="middle"
          dominantBaseline="middle"
          className="chart-label"
          style={{ fontSize: '36px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={onPassRateClick} // Reset to show all tests
        >
          {passRate}%
        </text>
        <text
          x={250}
          y={280}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '16px', cursor: 'pointer' }}
          onClick={onPassRateClick} // Reset to show all tests
        >
          Pass rate
        </text>
      </PieChart>
      {/* Legend */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Box display="flex" alignItems="center" mx={2}>
          <Box width={12} height={12} bgcolor="#28a745" mr={1} />
          <Typography variant="body2">Passed</Typography>
        </Box>
        <Box display="flex" alignItems="center" mx={2}>
          <Box width={12} height={12} bgcolor="#dc3545" mr={1} />
          <Typography variant="body2">Failed</Typography>
        </Box>
        <Box display="flex" alignItems="center" mx={2}>
          <Box width={12} height={12} bgcolor="#ffc107" mr={1} />
          <Typography variant="body2">Unresolved</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportsChart;
