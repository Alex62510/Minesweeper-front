import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PresetDifficulty } from '../../types/gameTypes.ts';

type Difficulty = PresetDifficulty | 'custom';

const difficultyPresets: Record<
  PresetDifficulty,
  {
    rows: number;
    cols: number;
    mines: number;
  }
> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

const OfflineSetup = () => {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [mines, setMines] = useState(10);

  const startGame = () => {
    navigate('/game', {
      state: { rows, cols, mines, difficulty },
    });
  };

  const handleDifficultyChange = (value: Difficulty) => {
    setDifficulty(value);

    if (value !== 'custom') {
      const preset = difficultyPresets[value];
      setRows(preset.rows);
      setCols(preset.cols);
      setMines(preset.mines);
    }
  };

  const isLocked = difficulty !== 'custom';

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-[420px] p-8 bg-white text-gray-900 rounded-3xl shadow-2xl animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-6">Offline Setup</h1>

        {/* Difficulty Select */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) =>
              handleDifficultyChange(e.target.value as Difficulty)
            }
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-1">Rows</label>
            <input
              type="number"
              value={rows}
              disabled={isLocked}
              onChange={(e) => setRows(Number(e.target.value))}
              className={`w-full p-3 border rounded-xl transition ${
                isLocked
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>

          <div>
            <label className="block mb-1">Columns</label>
            <input
              type="number"
              value={cols}
              disabled={isLocked}
              onChange={(e) => setCols(Number(e.target.value))}
              className={`w-full p-3 border rounded-xl transition ${
                isLocked
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>

          <div>
            <label className="block mb-1">Mines</label>
            <input
              type="number"
              value={mines}
              disabled={isLocked}
              onChange={(e) => setMines(Number(e.target.value))}
              className={`w-full p-3 border rounded-xl transition ${
                isLocked
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold
                     transition hover:scale-105 hover:bg-blue-700 active:scale-95 cursor-pointer"
        >
          Start Game
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 mt-5 rounded-2xl bg-gray-500 text-white font-semibold
                            transition hover:scale-105 hover:bg-gray-600 active:scale-95 cursor-pointer"
        >
          Back to Main
        </button>
      </div>
    </div>
  );
};

export default OfflineSetup;
