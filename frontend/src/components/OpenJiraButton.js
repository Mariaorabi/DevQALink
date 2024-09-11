import React from 'react';

const OpenJiraButton = ({ issueDetails }) => {
    const openJiraTicket = () => {
        // השתמש בפרטי התקלה כדי לבנות את ה-URL
        const jiraUrl = `https://moatazody44.atlassian.net/secure/CreateIssueDetails!init.jspa?pid=10000&issuetype=10002&summary=${encodeURIComponent(issueDetails.summary)}&description=${encodeURIComponent(issueDetails.description)}`;
        
        window.open(jiraUrl, '_blank');
    };

    return (
        <button onClick={openJiraTicket}>Open Bug in Jira</button>
    );
};

export default OpenJiraButton;
