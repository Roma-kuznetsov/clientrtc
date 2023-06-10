import './App.css';
import { Home } from './pages/Home';
import { Room } from './pages/Room';

import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:id" element={<Room />} />
    </Routes>
  );
}

export default App;
