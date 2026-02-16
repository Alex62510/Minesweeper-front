import { useGame } from '../../hooks/useGame.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type PropsType = {
  rows: number;
  cols: number;
  mines: number;
};

const GameBoard = ({ rows, cols, mines }: PropsType) => {
  const navigate = useNavigate();

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
  } = useGame({ rows, cols, mines, difficulty: 'beginner' });

  const [confetti] = useState(() =>
    Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
    })),
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6 relative">
      {/* Панель статуса */}
      <div
        className="mb-6 p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow-lg flex items-center gap-2 text-lg font-mono text-gray-800 border border-white/30
                animate-fadeIn"
      >
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
          className="ml-auto px-4 py-1 bg-blue-500 text-white rounded-xl shadow-lg cursor-pointer
                   hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Reset
        </button>
        <button
          onClick={() => navigate(-1)}
          className="ml-2 px-4 py-1 bg-gray-500 text-white rounded-xl shadow-lg cursor-pointer
                   hover:bg-gray-600 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Back
        </button>
      </div>

      {/* Проигрыш */}
      {status === 'lost' && (
        <div className="absolute top-1/3 text-6xl md:text-6xl font-black text-red-600 z-20 animate-blood-drip">
          💀 ВЫ ПРОИГРАЛИ 💀
        </div>
      )}

      {/* Победа */}
      {status === 'won' && (
        <>
          <div className="absolute top-1/3 text-6xl md:text-8xl font-black text-green-500 z-20 animate-win-glow text-center">
            🎉 ВЫ ВЫИГРАЛИ! 🎉
          </div>

          {/* Конфетти — НЕ ТРОГАЕМ ЛОГИКУ */}
          <div className="absolute inset-0 pointer-events-none">
            {confetti.map((c, i) => (
              <span
                key={i}
                className="absolute text-yellow-500 text-2xl animate-fall"
                style={{
                  left: c.left,
                  animationDelay: c.delay,
                }}
              >
                🎊
              </span>
            ))}
          </div>
        </>
      )}

      {/* Игровое поле */}
      <div className="p-4 bg-white rounded-3xl shadow-2xl border">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const isExploded =
                cell.isOpen && cell.isMine && status === 'lost';

              return (
                <div
                  key={c}
                  className={`
                                    w-9 h-9 m-[2px] flex items-center justify-center
                                    rounded-md text-sm font-bold
                                    transition-all duration-150
                                    ${
                                      cell.isOpen
                                        ? 'bg-gray-200 shadow-inner'
                                        : 'bg-gray-300 hover:bg-gray-200 cursor-pointer shadow'
                                    }
                                    ${cell.isFlagged ? 'bg-red-400 text-white' : ''}
                                    ${isExploded ? 'bg-red-700 text-white animate-pulse' : ''}
                                `}
                  onClick={() => handleOpenCell(r, c)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleToggleFlag(r, c);
                  }}
                  onDoubleClick={() => handleAutoOpen(r, c)}
                >
                  {cell.isOpen && !isExploded && cell.neighborMines > 0 && (
                    <span
                      className={`
                                                ${
                                                  cell.neighborMines === 1 &&
                                                  'text-blue-600'
                                                }
                                                ${
                                                  cell.neighborMines === 2 &&
                                                  'text-green-600'
                                                }
                                                ${
                                                  cell.neighborMines === 3 &&
                                                  'text-red-600'
                                                }
                                                ${
                                                  cell.neighborMines >= 4 &&
                                                  'text-purple-700'
                                                }
                                            `}
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
  );
};

export default GameBoard;
