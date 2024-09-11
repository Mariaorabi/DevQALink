import * as React from 'react';
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

// Example jobs data with tests
const jobs = [
    { job_id: 1, job_name: 'Job_1', date_scheduled: '2024-09-01T08:00:00', pool_id: 'POOL_1', priority: 'High', schedule_type: 'Automatic', cluster_id: 'CLUSTER_1', estimatedTime: '00:40:00' },
    { job_id: 2, job_name: 'Job_2', date_scheduled: '2024-09-01T09:00:00', pool_id: 'POOL_2', priority: 'Low', schedule_type: 'Manual', cluster_id: 'CLUSTER_2', estimatedTime: '00:20:00' }
];

const tests = {
    1: [
        { test_id: 'T1', status: 'Finished', version_build: 'v1.0.0', cluster_id: 'CLUSTER_1', test_result: 'Pass', reason_of_fail: '', runtime_duration: '00:15:00', date: '2024-09-01T08:15:00', user: 'User_A' },
        { test_id: 'T2', status: 'Finished', version_build: 'v1.0.0', cluster_id: 'CLUSTER_1', test_result: 'Fail', reason_of_fail: 'Timeout', runtime_duration: '00:30:00', date: '2024-09-01T08:45:00', user: 'User_B' }
    ],
    2: [
        { test_id: 'T3', status: 'Finished', version_build: 'v1.0.1', cluster_id: 'CLUSTER_2', test_result: 'Pass', reason_of_fail: '', runtime_duration: '00:10:00', date: '2024-09-01T09:10:00', user: 'User_C' }
    ]
};

// Utility function to convert time strings to seconds
const convertToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

// Calculate total runtime of all tests for a job
const calculateTotalRuntime = (tests) => {
    return tests.reduce((total, test) => total + convertToSeconds(test.runtime_duration), 0);
};

// Convert seconds back to hh:mm:ss format
const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

function Row({ row }) {
    const [open, setOpen] = React.useState(false);
    const actualRuntime = calculateTotalRuntime(tests[row.job_id]);
    const isOvertime = actualRuntime > convertToSeconds(row.estimatedTime);
    
    return (
        <>
            <TableRow sx={{ bgcolor: isOvertime ? 'red' : 'green' }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.job_id}
                </TableCell>
                <TableCell>{row.job_name}</TableCell>
                <TableCell>{row.date_scheduled}</TableCell>
                <TableCell>{row.pool_id}</TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>{row.schedule_type}</TableCell>
                <TableCell>{row.cluster_id}</TableCell>
                <TableCell>{row.estimatedTime}</TableCell>
                <TableCell>{formatTime(actualRuntime)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Tests
                            </Typography>
                            <Table size="small" aria-label="tests">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Test ID</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Version Build</TableCell>
                                        <TableCell>Cluster ID</TableCell>
                                        <TableCell>Test Result</TableCell>
                                        <TableCell>Reason of Failure</TableCell>
                                        <TableCell>Runtime Duration</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>User</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tests[row.job_id].map((test) => (
                                        <TableRow key={test.test_id}>
                                            <TableCell>{test.test_id}</TableCell>
                                            <TableCell>{test.status}</TableCell>
                                            <TableCell>{test.version_build}</TableCell>
                                            <TableCell>{test.cluster_id}</TableCell>
                                            <TableCell>{test.test_result}</TableCell>
                                            <TableCell>{test.reason_of_fail}</TableCell>
                                            <TableCell>{test.runtime_duration}</TableCell>
                                            <TableCell>{test.date}</TableCell>
                                            <TableCell>{test.user}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function JobTable() {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Job ID</TableCell>
                        <TableCell>Job Name</TableCell>
                        <TableCell>Date Scheduled</TableCell>
                        <TableCell>Pool ID</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Schedule Type</TableCell>
                        <TableCell>Cluster ID</TableCell>
                        <TableCell>Estimated Time</TableCell>
                        <TableCell>Actual Runtime</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {jobs.map((job) => (
                        <Row key={job.job_id} row={job} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
