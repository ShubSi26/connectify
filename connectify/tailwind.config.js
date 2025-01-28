/** @type {import('tailwindcss').Config} */

import { nextui } from "@nextui-org/react"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {fontFamily: {logo: ['Pacifico', 'cursive']}},
  },
  darkMode: "class",
  plugins: [nextui(),function ({ addUtilities }) {
    addUtilities({
      '.hidden-scrollbar': {
        /* Enable scrolling */
        overflow: 'auto',
        /* Hide scrollbars in Firefox */
        'scrollbar-width': 'none',
        /* Hide scrollbars in IE and Edge */
        '-ms-overflow-style': 'none',
      },
      '.hidden-scrollbar::-webkit-scrollbar': {
        /* Hide scrollbars in Chrome, Safari, and Opera */
        display: 'none',
      },
    });
  },
],  
}

