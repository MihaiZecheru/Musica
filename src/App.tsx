import './index.css';
import "./mdbootstrap/css/mdb.min.css"

import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Search from './components/Search';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          {/* <Route path="/" element={ <Home /> } /> */}
          <Route path="/search" element={ <Search /> } />
          {/* <Route path="/queue" element={ <Queue /> } /> */}

          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;