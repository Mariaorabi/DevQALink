import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import '../style/PoolSelection.css'; // Import the CSS file for PoolSelection

function PoolSelection() {
    const [pools, setPools] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPools = async () => {
            try {
                const response = await axios.get('http://localhost:5000/pools');
                setPools(response.data);
            } catch (error) {
                console.error('Error fetching pools:', error);
            }
        };

        fetchPools();
    }, []);

    const handlePoolClick = (poolId) => {
        navigate(`/clusters/${poolId}`);
    };

    return (
        <div>
            <a href='/' title="Versions & Builds">
                <button>Home Page</button>
            </a>
            <h1>Select a Pool</h1>
            <div className="pool-selection-container">
                {pools.map((pool) => (
                    <div
                        key={pool._id} // Change to use `_id` from backend
                        onClick={() => handlePoolClick(pool._id)} // Use `_id` for navigation
                        className="pool-card"
                    >
                        <img
                            src={pool.photoUrl}
                            alt={pool.name}
                        />
                        <p>{pool.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PoolSelection;
