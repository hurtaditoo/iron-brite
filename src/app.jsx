import Navbar from './components/ui/navbar/navbar';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home></Home>} />
      </Routes>
    </>
  );
}

export default App
