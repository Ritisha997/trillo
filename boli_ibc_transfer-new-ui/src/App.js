import logo from './logo.svg';
import { message } from "antd";
import "react-loading-skeleton/dist/skeleton.css";
import './App.scss';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Asssets from './containers/Asset';
import IbcTransfer from './containers/Ibc Send';

function App() {
  return (
    <>
      <Navbar />
      <div className="app_container">
        <div className="max_width">
          <Routes>
            <Route path="*" element={<Asssets />} />
            <Route path="/asset" element={<Asssets />} />
            <Route path="/ibc_transfer" element={<IbcTransfer />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
