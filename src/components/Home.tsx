import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const gridSize = 16;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* ONLINE (левая часть) */}
      <div
        onClick={() => navigate('/online')}
        className="w-1/2 relative cursor-pointer flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105"
      >
        {/* Цветная сетка */}
        <div className="absolute inset-0 grid grid-cols-16 grid-rows-16 gap-[1px]">
          {Array.from({ length: gridSize * gridSize }).map((_, i) => (
            <div
              key={i}
              className="
                bg-green-400 border border-green-500 rounded-sm
                transition-transform duration-300
                hover:scale-80 hover:rotate-10 hover:shadow-lg
              "
            />
          ))}
        </div>

        {/* Текст */}
        <div className="relative z-10 bg-black/30 p-8 rounded-2xl backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            ONLINE MODE
          </h1>
        </div>
      </div>

      {/* OFFLINE (правая часть) */}
      <div
        onClick={() => navigate('/offline')}
        className="w-1/2 relative cursor-pointer flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105"
      >
        {/* Чёрно-белая сетка */}
        <div className="absolute inset-0 grid grid-cols-16 grid-rows-16 gap-[1px]">
          {Array.from({ length: gridSize * gridSize }).map((_, i) => (
            <div
              key={i}
              className="
                bg-gray-400 border border-gray-500 rounded-sm
                transition-transform duration-300
                hover:scale-80 hover:-rotate-10 hover:shadow-md
              "
            />
          ))}
        </div>

        {/* Текст */}
        <div className="relative z-10 bg-black/30 p-8 rounded-2xl backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            OFFLINE MODE
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
