import AppRoutes from './route/AppRoutes.tsx';
import { useAuthInit } from './hooks/useAuthInit.ts';

function App() {
  useAuthInit();
  return (
    <div className={''}>
      <AppRoutes />
    </div>
  );
}

export default App;
