import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/ClusterView.css';

function ClusterView() {
    const { poolId } = useParams();
    const navigate = useNavigate();
    const [pool, setPool] = useState(null);
    const [clusters, setClusters] = useState([]);

    useEffect(() => {
        const fetchPool = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/pools/${poolId}`);
                setPool(response.data);
            } catch (error) {
                console.error('Error fetching pool:', error);
            }
        };

        const fetchClusters = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/clusters/${poolId}`);
                setClusters(response.data);
            } catch (error) {
                console.error('Error fetching clusters:', error);
            }
        };

        fetchPool();
        fetchClusters();
    }, [poolId]);

    if (!pool) {
        return <div>Pool not found</div>;
    }

    const handleClusterClick = (clusterId) => {
        navigate(`/servers/${pool._id}/${clusterId}`);
    };

    return (
        <div className="cluster-view-container">
            <a href='/' title="Versions & Builds">
                <button>Home Page</button>
            </a>
            <h1>{pool.name} Clusters</h1>
            <p className="cluster-description">
                Explore the clusters of {pool.name} and choose the one you want to manage.
            </p>
            <div className="cluster-card-container">
                {clusters.map((cluster) => (
                    <div
                        key={cluster._id}
                        onClick={() => handleClusterClick(cluster._id)}
                        className="cluster-card"
                    >
                        <p>{cluster.name}</p>
                        <p>
                            Status: <span className={cluster.status.toLowerCase()}>{cluster.status}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClusterView;
