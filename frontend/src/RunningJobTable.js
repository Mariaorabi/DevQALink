import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from '@mui/material/styles';
import './JobTable.css';

// Styled table container
const StyledTableContainer = styled(TableContainer)({
    maxWidth: '100%',
    overflowX: 'auto',
});

// Utility function to calculate elapsed time in a human-readable format
const formatElapsedTime = (startTime) => {
    const now = new Date();
    const elapsed = now - new Date(startTime);
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
};

// Function to create data for the table
function createData(id, name, version, status, pool, schedType, estimatedRuntime, date, triggeredBy, startTime, tests) {
    return {
        id,
        name,
        version,
        status,
        pool,
        schedType,
        estimatedRuntime,
        date,
        triggeredBy,
        startTime,
        tests,
    };
}

// Adjusted Row Component
function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [actualRuntime, setActualRuntime] = React.useState(formatElapsedTime(row.startTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setActualRuntime(formatElapsedTime(row.startTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [row.startTime]);

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.pool}</TableCell>
                <TableCell>{row.schedType}</TableCell>
                <TableCell>{row.estimatedRuntime}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.triggeredBy}</TableCell>
                <TableCell>{actualRuntime}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Tests
                            </Typography>
                            <Table size="small" aria-label="tests">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Test Name</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Runtime Duration</TableCell>
                                        <TableCell>Test Result</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
  {row.tests.map((test, index) => (
    <TableRow key={index}>
      {/* Test Name */}
      <TableCell>{test.name}</TableCell>

      {/* Test Status: If test_result is Pass or Fail, display 'Finished', otherwise the actual status */}
      <TableCell>
        {test.test_result ? 'Finished' : test.status}
      </TableCell>

      {/* Elapsed Time */}
      <TableCell>{formatElapsedTime(row.startTime)}</TableCell>

      {/* Test Result: Pass/Fail or Pending */}
      <TableCell className={test.test_result === 'pass' ? 'test-pass' : test.test_result === 'fail' ? 'test-fail' : ''}>
        {test.test_result ? (test.test_result === 'pass' ? 'Pass' : 'Fail') : 'Pending'}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

// Main JobTable component
export default function JobTable() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('http://localhost:3000/Jobs/getRunningJobs');
                const data = await response.json();
                
                // Filter jobs with "running" status
                const filteredData = data
                    .filter(job => job.status === 'running')
                    .map(job => createData(
                        job._id,
                        job.name,
                        job.version,
                        job.status,
                        job.pool,
                        job.schedType,
                        job.estimatedRunTime,
                        job.date,
                        job.triggeredBy,
                        job.startTime,
                        job.tests.map((testName, idx) => ({
                            name: testName,
                            status: 'Running',
                            test_result: job.testResults[idx] || '',
                        }))
                    ));

                setRows(filteredData);
            } catch (error) {
                console.error('Error fetching job data:', error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <StyledTableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Version</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Pool</TableCell>
                        <TableCell>Schedule Type</TableCell>
                        <TableCell>Estimated Runtime</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Triggered By</TableCell>
                        <TableCell>Runtime Duration</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.id} row={row} />
                    ))}
                </TableBody>
            </Table>
        </StyledTableContainer>
    );
}
