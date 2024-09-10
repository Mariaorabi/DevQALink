import './App.css';
import Sign from './Authentication/Login/Sign/Sign';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Authentication/Login/Sign/Login';

import ForgotPassword from './Authentication/Login/ForgotPassword';
import {Provider} from 'react-redux';
import { store } from './Utility/Redux/store';
import { useEffect } from 'react';
import FaceRecognitionSignup from './Authentication/Login/Sign/FaceRecognitionSignup';

function App() {

  return (

    <Provider store={store}>

    <Router>
      <Routes>
        <Route path="/" element={<Sign />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/faceRecognition' element={<FaceRecognitionSignup/>}/>
        
      </Routes>
    </Router>

    </Provider>
  );
}

export default App;