export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        sand: '#f8fafc',
        accent: '#2563eb',
        accentSoft: '#dbeafe'
      },
      boxShadow: {
        soft: '0 24px 60px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
