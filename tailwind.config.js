/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'storm-gust': ['Storm Gust', 'Cinzel', 'serif'],
        'medieval': ['Cinzel', 'serif'],
        'medieval-title': ['Uncial Antiqua', 'cursive'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-8px)' }, // Tremor mais forte
          '20%, 40%, 60%, 80%': { transform: 'translateX(8px)' },   // Tremor mais forte
        },
        'final-glow': { // Esta animação será usada para o resultado final do DiceRoller
          '0%, 100%': {
            textShadow: '0 0 8px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.5)',
            transform: 'scale(1)',
          },
          '50%': {
            textShadow: '0 0 15px rgba(255, 255, 255, 1), 0 0 25px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6)',
            transform: 'scale(1.05)', // Leve pulsaçãoo
          },
        },
      },
      animation: {
        shake: 'shake 0.15s ease-in-out infinite', // Duração e iteração ajustadas para um tremor contínuo
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Mantido, se já existir
        'final-glow-result': 'final-glow 1.5s ease-in-out infinite alternate', // Animação de brilho e pulsação para o resultado
      },
    },
  },
  plugins: [],
}