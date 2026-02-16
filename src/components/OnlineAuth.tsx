import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.ts';
import api from '../store/axios.ts';
import { Eye, EyeOff } from 'lucide-react';

type Mode = 'login' | 'register';

const OnlineAuth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginStore = useAuthStore((s) => s.login);

  const handleSubmit = async () => {
    try {
      if (mode === 'login') {
        const { data } = await api.post('/auth/login', { email, password });
        loginStore({
          accessToken: data.accessToken,
          user: data.userData,
        });
        navigate('/online');
      } else {
        await api.post('/auth/register', { email, password, name });
        setMode('login');
        setName('');
        setPassword('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-700 p-6 relative overflow-hidden">
      {/* Фоновые клетки */}
      <div className="absolute inset-0 grid grid-cols-16 grid-rows-16 gap-[2px] opacity-30">
        {Array.from({ length: 256 }).map((_, i) => (
          <div
            key={i}
            className="bg-cyan-300 animate-pulse"
            style={{ animationDelay: `${(i % 10) * 0.2}s` }}
          />
        ))}
      </div>

      {/* Карточка */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6 ">
          {mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
        </h1>

        {/* Переключатель */}
        <div className="flex mb-6 bg-blue-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setMode('login')}
            className={`w-1/2 py-2 font-semibold transition cursor-pointer ${
              mode === 'login'
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 hover:bg-blue-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`w-1/2 py-2 font-semibold transition ${
              mode === 'register'
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 hover:bg-blue-200'
            }`}
          >
            Register
          </button>
        </div>

        {mode === 'register' && (
          <input
            type="text"
            placeholder="Nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl border text-blue-600 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl text-blue-600 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Поле пароля с иконкой */}
        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 rounded-xl text-blue-600 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold cursor-pointer
                     shadow-lg transition hover:scale-105 hover:shadow-xl active:scale-95"
        >
          {mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 py-2 rounded-xl bg-gray-500 text-white font-semibold cursor-pointer
                     transition hover:bg-gray-600 hover:scale-105 active:scale-95"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
export default OnlineAuth;
