// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Sidebar'; // Adjusted the import path for Sidebar
// import Home from './pages/Home';
// import MyWork from './pages/MyWork';
// import Dashboards from './pages/Dashboards';
// import Help from './pages/Help';
// import Requests from './pages/Requests';
// import Jobs from './pages/Jobs/Jobs'; // Points to the Jobs component
// import Running from './pages/Running'; // Running jobs page
// import Completed from './pages/Completed'; // Completed jobs page
// import Portfolios from './pages/Portfolios';
// import Programs from './pages/Programs';

// const App = () => {
//     return (
//         <Router>
//             <div style={{ display: 'flex' }}>
//                 <Sidebar />
//                 <div style={{ marginLeft: 240, padding: '20px', width: '100%' }}>
//                     <Routes>
//                         <Route path="/" element={<Home />} />
//                         <Route path="/my-work" element={<MyWork />} />
//                         <Route path="/dashboards" element={<Dashboards />} />
//                         <Route path="/help" element={<Help />} />
//                         <Route path="/requests" element={<Requests />} />
//                         <Route path="/jobs" element={<Jobs />} /> {/* Route for Jobs */}
//                         <Route path="/jobs/running" element={<Running />} /> {/* Route for Running Jobs */}
//                         <Route path="/jobs/completed" element={<Completed />} /> {/* Route for Completed Jobs */}
//                         <Route path="/portfolios" element={<Portfolios />} />
//                         <Route path="/programs" element={<Programs />} />
//                     </Routes>
//                 </div>
//             </div>
//         </Router>
//     );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopTabs from './components/TopTabs'; // Import the TopTabs component
import Home from './pages/Home';
import MyWork from './pages/MyWork';
import Dashboards from './pages/Dashboards';
import Help from './pages/Help';
import Requests from './pages/Requests';
import Jobs from './pages/Jobs/Jobs'; // Points to the Jobs component
import Running from './pages/Running/RunningJobTable'; // Running jobs page
import Completed from './pages/Completed'; // Completed jobs page
import Portfolios from './pages/Portfolios';
import Programs from './pages/Programs';

const App = () => {
    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TopTabs />
                <div style={{ padding: '20px', flexGrow: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/my-work" element={<MyWork />} />
                        <Route path="/dashboards" element={<Dashboards />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/requests" element={<Requests />} />
                        <Route path="/jobs" element={<Jobs />} /> {/* Route for Jobs */}
                        <Route path="/jobs/running" element={<Running />} /> {/* Route for Running Jobs */}
                        <Route path="/jobs/completed" element={<Completed />} /> {/* Route for Completed Jobs */}
                        <Route path="/portfolios" element={<Portfolios />} />
                        <Route path="/programs" element={<Programs />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

/** return (
        <div className="App">
            <h1>Job Management System</h1>
            <JobTable />
        </div>
    ); */

export default App;

