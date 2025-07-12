/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    safelist: [
        'bg-blue-500',
        'text-red-600',
        'text-center'
    ],

    theme: {
        extend: {},
    },
    plugins: [],
}
