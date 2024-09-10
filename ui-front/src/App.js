import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PoolSelection from './components/PoolSelection';
import ClusterView from './components/ClusterView';
import ServerView from './components/ServerView';
import './style/App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PoolSelection />} />
                <Route path="/clusters/:poolId" element={<ClusterView />} />
                <Route path="/servers/:poolId/:clusterId" element={<ServerView />} />
            </Routes>
        </Router>
    );
}

export default App;
