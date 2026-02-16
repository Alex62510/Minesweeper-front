import { useLocation } from 'react-router-dom';
import OnlineGameBoard from './OnlineGameBoard.tsx';

const OnlineGame = () => {
  const location = useLocation();

  const config = location.state || {
    rows: 9,
    cols: 9,
    mines: 10,
    difficulty: 'beginner',
  };

  return (
    <div>
      <OnlineGameBoard
        rows={config.rows}
        cols={config.cols}
        mines={config.mines}
        difficulty={config.difficulty}
      />
    </div>
  );
};

export default OnlineGame;
