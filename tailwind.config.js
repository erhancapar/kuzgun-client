// tailwind.config.js
module.exports = {
  content: ['./public/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backdropFilter: ['responsive'],
      backdropBlur: ['responsive'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-filters'), // Add this line
  ],
};