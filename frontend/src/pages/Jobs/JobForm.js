import React, { useState, useEffect, useRef } from 'react';
import './JobForm.css';

const JobForm = ({ closeForm, onJobAdded }) => {
    const [formData, setFormData] = useState({
        jobName: '',
        testsToRun: [],
        resourcePool: '',
        buildVersion: '',
        jobRunType: 'Immediately',
        scheduleType: 'One-Time Job',
        scheduleTime: '',
        priorityLevel: '1',
        estimatedHours: '0',
        estimatedMinutes: '0'
    });

    const [isScheduleTypeDisabled, setIsScheduleTypeDisabled] = useState(true);
    const [poolNames, setPoolNames] = useState([]); // State to store pool names

    const formRef = useRef(null);

    // Fetch pool names from the database
    const fetchPoolNames = async () => {
        try {
            const response = await fetch('http://localhost:3000/pools/getAllPools'); // Update with your API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPoolNames(data.map(pool => pool.name)); // Assume the response structure
        } catch (error) {
            console.error('Error fetching pool names:', error);
        }
    };

    // Fetch pool names when component mounts
    useEffect(() => {
        fetchPoolNames();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const newData = {
                ...prevData,
                [name]: value
            };

            if (name === 'jobRunType') {
                if (value === 'Immediately') {
                    newData.scheduleType = '-';
                    setIsScheduleTypeDisabled(true);
                } else {
                    setIsScheduleTypeDisabled(false);
                }
            }

            return newData;
        });
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Ensure estimated hours and minutes are not both zero
        if (formData.estimatedHours === '0' && formData.estimatedMinutes === '0') {
            alert('Please select a valid estimated time. Estimated hours and minutes cannot both be zero.');
            return; // Exit the function without submitting the form
        }

        const estimatedTime = `${formData.estimatedHours}h ${formData.estimatedMinutes}m`;
    
        const validScheduleTypes = ['One-Time Job', 'Reoccurring Job'];
        const validScheduleType = validScheduleTypes.includes(formData.scheduleType) ? formData.scheduleType : '-';
    
        const testsArray = formData.testsToRun.split(',').map(test => test.trim()).filter(test => test);
    
        // Use current time if scheduleTime is empty
        const scheduleTime = formData.scheduleTime || getCurrentTime();

        const jobData = {
            ...formData,
            estimatedTime,
            scheduleType: formData.jobRunType === 'Immediately' ? '-' : validScheduleType, // Updated line
            scheduleTime,
            testsToRun: testsArray,
            
        };

        try {
            // Add if for Immediatley, so you POST to ReadyJobs, else POST to WaitingJobs.
            // Also, define jobStatus as 'Ready' for ReadyJobs and 'Waiting' for WaitingJobs.
            // (jobStatus: formData.jobRunType === 'Immediately' ? 'Ready' : 'Waiting')
            // But before that, you have to schedule that by the priority level.
            // *************************************************************

            const response = await fetch('http://localhost:3000/jobs/waitingJobs/addJob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Job added successfully!');
                console.log('Job ID:', result.job.jobId);

                if (onJobAdded) {
                    onJobAdded(result.job);
                }

                closeForm();

            } else {
                console.error('Failed to add job:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while adding job:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                closeForm();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeForm]);

    const generateOptions = (start, end) => {
        const options = [];
        for (let i = start; i <= end; i++) {
            options.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }
        return options;
    };

    return (
        <div className="form-overlay">
            <div className="form-card" ref={formRef}>
                <button className="close-btn" onClick={closeForm}>&times;</button>
                <form className="form-container" onSubmit={handleSubmit}>
                    <h2>Add New Job</h2>

                    <div className="form-row">
                        <label htmlFor="jobName">Job Name</label>
                        <input type="text" id="jobName" name="jobName" value={formData.jobName} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <label htmlFor="testsToRun">Tests to Run</label>
                        <input type="text" id="testsToRun" name="testsToRun" value={formData.testsToRun} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <label htmlFor="resourcePool">Resource Pool</label>
                        <select id="resourcePool" name="resourcePool" value={formData.resourcePool} onChange={handleChange} required>
                            <option value="" disabled>Select a pool</option>
                            {poolNames.map(pool => (
                                <option key={pool} value={pool}>{pool}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label htmlFor="buildVersion">Build Version</label>
                        <input type="text" id="buildVersion" name="buildVersion" value={formData.buildVersion} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <label htmlFor="jobRunType">Job Run Type</label>
                        <select id="jobRunType" name="jobRunType" value={formData.jobRunType} onChange={handleChange} required>
                            <option value="Immediately">Immediately</option>
                            <option value="Scheduled">Scheduled</option>
                        </select>
                    </div>

                    {formData.jobRunType === 'Scheduled' && (
                        <>
                            <div className="form-row">
                                <label htmlFor="scheduleType">Schedule Type</label>
                                <select
                                    id="scheduleType"
                                    name="scheduleType"
                                    value={formData.scheduleType}
                                    onChange={handleChange}
                                    disabled={isScheduleTypeDisabled}
                                    required={!isScheduleTypeDisabled}
                                >
                                    <option value="One-Time Job">One-Time Job</option>
                                    <option value="Reoccurring Job">Reoccurring Job</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <label htmlFor="scheduleTime">Schedule Time</label>
                                <input
                                    type="time"
                                    id="scheduleTime"
                                    name="scheduleTime"
                                    value={formData.scheduleTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="form-row">
                        <label htmlFor="priorityLevel">Priority Level</label>
                        <select
                            id="priorityLevel"
                            name="priorityLevel"
                            value={formData.priorityLevel}
                            onChange={handleChange}
                            required
                        >
                            {generateOptions(1, 10)}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Estimated Tests Time</label>
                        <div className="time-select">
                            <select
                                name="estimatedHours"
                                value={formData.estimatedHours}
                                onChange={handleChange}
                                required
                            >
                                {generateOptions(0, 48)}
                            </select>
                            <span>Hours</span>
                            <select
                                name="estimatedMinutes"
                                value={formData.estimatedMinutes}
                                onChange={handleChange}
                                required
                            >
                                {generateOptions(0, 59)}
                            </select>
                            <span>Minutes</span>
                        </div>
                    </div>

                    <div className="btn-container">
                        <button type="submit" className="submit-btn">Add Job</button>
                        <button type="button" className="cancel-btn" onClick={closeForm}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobForm;
