import { useLocation } from 'react-router-dom';
import GameBoard from './GameBoard.tsx';

const Game = () => {
  const location = useLocation();

  const config = location.state || {
    rows: 9,
    cols: 9,
    mines: 10,
  };

  return (
    <GameBoard rows={config.rows} cols={config.cols} mines={config.mines} />
  );
};

export default Game;
