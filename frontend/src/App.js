import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import DashboardLayout from './components/menu';



function App() {
  return (
    <BrowserRouter>
      <DashboardLayout />
    </BrowserRouter>
  );
}

export default App;
