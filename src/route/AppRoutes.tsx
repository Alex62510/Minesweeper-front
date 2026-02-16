import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../components/Home.tsx';
import OfflineSetup from '../components/Game/OfflineSetup.tsx';
import Game from '../components/Game/Game.tsx';
import OnlineSetup from '../components/OnlineGame/OnlineSetup.tsx';
import OnlineGame from '../components/OnlineGame/OnlineGame.tsx';

import PrivateRoute from './PrivateRoute.tsx';
import OnlineAuth from '../components/OnlineAuth.tsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/offline" element={<OfflineSetup />} />
      <Route path="/game" element={<Game />} />
      <Route path="/auth" element={<OnlineAuth />} />
      <Route element={<PrivateRoute />}>
        <Route path="/online" element={<OnlineSetup />} />
        <Route path="/onlineGame" element={<OnlineGame />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
