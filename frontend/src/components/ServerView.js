import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../style/ServerView.css';


function ServerView() {
    const { poolId, clusterId } = useParams();
    const [cluster, setCluster] = useState(null);
    const [servers, setServers] = useState([]);
    const [pool, setPool] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // Control popup visibility
    const [selectedServer, setSelectedServer] = useState(null); // Store selected server

    useEffect(() => {
        const fetchCluster = async () => {
            try {
                const clustersResponse = await axios.get(`http://localhost:5000/clusters/${poolId}`);
                const clusters = clustersResponse.data;
                const selectedCluster = clusters.find((cluster) => cluster._id === clusterId);
                if (selectedCluster) {
                    setCluster(selectedCluster);
                } else {
                    console.error('Cluster not found');
                }
            } catch (error) {
                console.error('Error fetching cluster:', error);
            }
        };

        const fetchServers = async () => {
            try {
                const serversResponse = await axios.get(`http://localhost:5000/servers/${clusterId}`);
                setServers(serversResponse.data);
            } catch (error) {
                console.error('Error fetching servers:', error);
            }
        };

        const fetchPool = async () => {
            try {
                const poolResponse = await axios.get(`http://localhost:5000/pools/${poolId}`);
                setPool(poolResponse.data);
            } catch (error) {
                console.error('Error fetching pool:', error);
            }
        };

        fetchCluster();
        fetchServers();
        fetchPool();
    }, [poolId, clusterId]);

    if (!pool || !cluster) {
        return <div className="server-view-container">Pool or Cluster not found</div>;
    }

    const handleServerClick = (server) => {
        setSelectedServer(server);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedServer(null);
    };

    const runnerServer = servers[0];
    const remainingServers = servers.slice(1);

    return (
        <div className="server-view-container">
            <a href='/' title="Versions & Builds">
                <button>Home Page</button>
            </a>
            <h1>Manage the Servers of {cluster.name}</h1>
            <p>Located in the {pool.name} Pool</p>

            {runnerServer && (
                <div className="runner-server" onClick={() => handleServerClick(runnerServer)}>
                    <p>{runnerServer.ipAddress} (Runner)</p>
                </div>
            )}

            <div className="server-card-container">
                {remainingServers.map((server) => (
                    <div key={server._id} className="server-card" onClick={() => handleServerClick(server)}>
                        <p>{server.ipAddress}</p>
                    </div>
                ))}
            </div>

            {showPopup && selectedServer && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Server Details</h2>
                        <p>IP Address: {selectedServer.ipAddress}</p>
                        <p>Runner Status: {selectedServer.isRunner ? "Yes" : "No"}</p>
                        <button onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServerView;
