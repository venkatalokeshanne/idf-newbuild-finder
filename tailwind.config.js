const c = (v) => `rgb(var(--${v}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'), bg2: c('bg2'), panel: c('panel'), panel2: c('panel2'), line: c('line'),
        ink: c('ink'), muted: c('muted'), accent: c('accent'), 'accent-ink': c('accent-ink'),
        ok: c('ok'), warn: c('warn'), mute: c('mute'), bad: c('bad'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: { lift: '0 10px 30px rgba(0,0,0,.28)' },
    },
  },
  plugins: [],
}
