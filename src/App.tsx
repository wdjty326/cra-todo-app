import { Route, Routes } from 'react-router-dom';

import ListPage from './pages/ListPage';
import EditPage from './pages/EditPage';
import { GlobalPortal } from './GlobalPortal';

function App() {
  return (
    <GlobalPortal.Provider>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
      </Routes>
    </GlobalPortal.Provider>
  );
}

export default App;
