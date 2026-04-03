import './App.css'
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import Home from './pages/Home';
import View from './view/View';
import AddEdit from './pages/AddEdit';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <div className="app-shell">
      <Header />
      <ToastContainer position="top-right" autoClose={2200} />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEdit />} />
          <Route path="/update/:id" element={<AddEdit />} />
          <Route path="/view/:id" element={<View />} />
        </Routes>
      </main>

    </div>
  )
}

export default App
