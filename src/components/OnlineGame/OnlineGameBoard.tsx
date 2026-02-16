import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../hooks/useGame.ts';
import { useAuthStore } from '../../store/authStore.ts';
import { useResultsStore } from '../../store/resultStore.ts';
import { GamesApi } from '../../api/games.api.ts';
import { AuthApi } from '../../api/auth.api.ts';

export type PropsType = {
  rows: number;
  cols: number;
  mines: number;
  difficulty: 'beginner' | 'intermediate' | 'expert';
};

const OnlineGameBoard = ({ rows, cols, mines, difficulty }: PropsType) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const results = useResultsStore((s) => s.results);
  const fetchResults = useResultsStore((s) => s.fetchResults);
  const addResult = useResultsStore((s) => s.addResult);

  const [confetti] = useState(() =>
    Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
    })),
  );

  const {
    board,
    status,
    time,
    bestTime,
    handleOpenCell,
    handleToggleFlag,
    handleAutoOpen,
    minesLeft,
    resetGame,
  } = useGame({ rows, cols, mines, difficulty });

  const cellSize = useMemo(() => {
    const maxHeight = window.innerHeight - 220;
    const maxWidth = window.innerWidth - 48;
    const sizeByHeight = Math.floor(maxHeight / rows);
    const sizeByWidth = Math.floor(maxWidth / cols);
    return Math.min(sizeByHeight, sizeByWidth, 40);
  }, [rows, cols]);

  const handleLogout = async () => {
    try {
      await AuthApi.logout();
    } finally {
      logout();
      navigate('/');
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (status === 'won') {
      sendResult();
    }
  }, [status]);

  const sendResult = async () => {
    try {
      const data = await GamesApi.saveResult({
        userId: user!.id,
        email: user!.email,
        name: user!.name,
        difficulty,
        time,
      });

      addResult(data);
    } catch (err) {
      console.error('Failed to send result', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-blue-200 to-blue-400 gap-4">
      {/* Панель статистики */}
      <div className="w-full max-w-2xl flex flex-wrap justify-center md:justify-start gap-3 p-4 bg-white/70 backdrop-blur-md rounded-3xl shadow-lg text-lg font-mono text-gray-800 border border-white/30 animate-fadeIn">
        <div className="flex items-center gap-2 transition-all duration-500 hover:scale-105">
          ⏱ <span className="font-semibold">{time}s</span>
        </div>

        <div className="flex items-center gap-2 transition-all duration-500 hover:scale-105">
          🏆 <span className="font-semibold">{bestTime ?? '-'}s</span>
        </div>

        <div className="flex items-center gap-2 transition-all duration-500 hover:scale-105">
          💣 <span className="font-semibold">{minesLeft}</span>
        </div>

        <div
          className={`font-bold px-4 py-1 rounded-xl transition-all duration-500 ${
            status === 'won'
              ? 'text-green-700 bg-green-100 animate-pulse'
              : status === 'lost'
                ? 'text-red-700 bg-red-100 animate-pulse'
                : 'text-gray-700 bg-gray-100'
          }`}
        >
          {status.toUpperCase()}
        </div>

        <button
          onClick={resetGame}
          className="ml-auto px-4 py-1 bg-blue-600 text-white rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Reset
        </button>

        <button
          onClick={() => navigate('/online')}
          className="px-4 py-1 bg-gray-500 text-white rounded-xl shadow-lg cursor-pointer hover:bg-gray-600 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-red-500 text-white rounded-xl shadow-lg cursor-pointer hover:bg-gray-600 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          LogOut
        </button>
      </div>

      {/* Игровое поле без вертикального скролла */}
      <div className="flex justify-center w-full max-w-7xl flex-grow">
        <div
          className="bg-white rounded-3xl shadow-2xl p-3 flex flex-col justify-center items-center"
          style={{
            width: cols * (cellSize + 4),
            height: rows * (cellSize + 4),
          }}
        >
          {board.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => {
                const isExploded =
                  cell.isOpen && cell.isMine && status === 'lost';
                return (
                  <div
                    key={c}
                    className={`
                flex items-center justify-center rounded-sm font-bold
                transition-all duration-150
                ${cell.isOpen ? 'bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner' : 'bg-gradient-to-br from-blue-300 to-blue-400 hover:from-blue-200 hover:to-blue-300 cursor-pointer shadow-md'}
                ${cell.isFlagged ? 'bg-red-500 text-white animate-pulse' : ''}
                ${isExploded ? 'bg-red-700 text-white animate-pulse' : ''}
                border border-blue-500
                hover:scale-105 hover:shadow-lg
              `}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      fontSize: Math.floor(cellSize * 0.6),
                    }}
                    onClick={() => handleOpenCell(r, c)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleToggleFlag(r, c);
                    }}
                    onDoubleClick={() => handleAutoOpen(r, c)}
                  >
                    {cell.isOpen && !isExploded && cell.neighborMines > 0 && (
                      <span
                        className={`${
                          cell.neighborMines === 1
                            ? 'text-blue-800'
                            : cell.neighborMines === 2
                              ? 'text-green-700'
                              : cell.neighborMines === 3
                                ? 'text-red-700'
                                : 'text-purple-800'
                        } font-bold`}
                      >
                        {cell.neighborMines}
                      </span>
                    )}
                    {cell.isFlagged && !cell.isOpen && '🚩'}
                    {isExploded && '💣'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Победа */}
      {status === 'won' && (
        <>
          <div className="absolute top-1/3 text-6xl md:text-8xl font-black text-green-500 z-20 animate-win-glow text-center">
            🎉 ВЫ ВЫИГРАЛИ! 🎉
          </div>
          <div className="absolute inset-0 pointer-events-none">
            {confetti.map((c, i) => (
              <span
                key={i}
                className="absolute text-yellow-500 text-2xl animate-fall"
                style={{ left: c.left, animationDelay: c.delay }}
              >
                🎊
              </span>
            ))}
          </div>
        </>
      )}
      {/* Проигрыш */}
      {status === 'lost' && (
        <div className="absolute top-1/3 text-6xl md:text-6xl font-black text-red-600 z-20 animate-blood-drip">
          💀 ВЫ ПРОИГРАЛИ 💀
        </div>
      )}
      {/* Таблица топ игроков снизу */}
      <div className="bg-white/90 rounded-3xl shadow-lg p-6 w-full max-w-7xl overflow-x-auto mt-4">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
          Top Players
        </h2>
        <table className="w-full text-left border-collapse min-w-[400px] text-blue-600">
          <thead>
            <tr className="bg-blue-200">
              <th className="p-2 border-b border-blue-300">#</th>
              <th className="p-2 border-b border-blue-300">Player</th>
              <th className="p-2 border-b border-blue-300">Email</th>
              <th className="p-2 border-b border-blue-300">Level</th>
              <th className="p-2 border-b border-blue-300">Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((score, idx) => (
              <tr key={idx} className="hover:bg-blue-100 transition-colors">
                <td className="p-2 border-b border-blue-200">{idx + 1}</td>
                <td className="p-2 border-b border-blue-200">{score.name}</td>
                <td className="p-2 border-b border-blue-200">{score.email}</td>
                <td className="p-2 border-b border-blue-200">
                  {score.difficulty}
                </td>
                <td className="p-2 border-b border-blue-200">{score.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnlineGameBoard;
