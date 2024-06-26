import './index.css';
import "./mdbootstrap/css/mdb.min.css"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authenticator from './components/Authenticator';
import Register from './components/Register';
import Login from './components/Login';
import Search from './components/Search';
import Home from './components/Home';
import Landing from './components/Landing';
import Queue from './components/Queue';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <div className="content">
        <Routes>
          { /* Unauthenticated routes */ }
          <Route path="/" element={ <Landing /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
          { /* Authenticated routes */}
          <Route path="/home" element={ <Authenticator component={<Home />} /> } />
          <Route path="/search" element={ <Authenticator component={<Search/>} /> } />
          <Route path="/queue" element={ <Authenticator component={<Queue />} /> } />
          <Route path="/logout" element={ <Authenticator component={<Logout/>} /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;