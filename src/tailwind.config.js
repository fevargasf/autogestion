module.exports = {
  prefix: '',
  purge: {
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  theme: {
    extend: {
      // Definir animaciones personalizadas
      animation: {
        // Nombre de la animación y duración
        'fade-in': 'fadeIn 1s ease-in-out',
        'pulse-slow': 'pulse 3s infinite', // Pulse lento
      },
      // Definir keyframes personalizados
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [require('preline/plugin'),require('tailwind-stepper'),require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
