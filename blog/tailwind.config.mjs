/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f7f4ef',
          muted: '#efe9e0',
          accent: '#e7e0d5',
          dark: '#d8d2c9',
        },
        ink: {
          DEFAULT: '#1a1714',
          soft: '#5e5851',
          muted: '#9b948b',
        },
        vermilion: {
          DEFAULT: '#b83a3a',
          hover: '#9c2e2e',
          light: '#d85c5c',
        },
        bronze: {
          DEFAULT: '#8c6b3d',
          light: '#c4a66f',
        },
        night: {
          DEFAULT: '#121110',
          muted: '#1a1816',
          accent: '#24211e',
          border: '#2f2c28',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"STSong"', 'SimSun', 'serif'],
        body: ['"Noto Serif SC"', '"Source Han Serif SC"', '"PingFang SC"', '"Microsoft YaHei"', 'serif'],
        seal: ['"Ma Shan Zheng"', '"ZCOOL XiaoWei"', '"STKaiti"', 'cursive'],
      },
      maxWidth: {
        'prose-chinese': '42em',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
};
