import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    {
      path: './fonts/Inter-VariableFont_opsz,wght.ttf',
      style: 'normal',
      weight: '100 900'
    }
  ],
  variable: '--font-inter',
  display: 'swap'
});
