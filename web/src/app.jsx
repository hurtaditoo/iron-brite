import Navbar from './components/ui/navbar/navbar';
import { Route, Routes } from 'react-router-dom';
import { Home, Search } from './pages';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </>
  );
}

export default App
