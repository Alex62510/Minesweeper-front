// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"], // убедись, что путь к компонентам правильный
    theme: {
        extend: {
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
                    '25%': { transform: 'translateX(-8px) rotate(-5deg)' },
                    '50%': { transform: 'translateX(8px) rotate(5deg)' },
                    '75%': { transform: 'translateX(-8px) rotate(-5deg)' },
                },
                pop: {
                    '0%': { transform: 'scale(0.8)' },
                    '50%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            animation: {
                shake: 'shake 0.5s infinite',
                pop: 'pop 0.8s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};