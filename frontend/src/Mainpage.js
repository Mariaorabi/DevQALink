import React from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import PoolSelection from './components/PoolSelection';
import ClusterView from './components/ClusterView';
import ServerView from './components/ServerView';
import './Mainpage.css';
import VersionBuildPage from './VersionBuildPage';

function Mainpage() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<VersionBuildPage />} />
                <Route path="/PoolSelection" element={<PoolSelection />} />
                <Route path="/clusters/:poolId" element={<ClusterView />} />
                <Route path="/servers/:poolId/:clusterId" element={<ServerView />} />
            </Routes>
        </BrowserRouter>

    );
}

export default Mainpage;
