import localFont from 'next/font/local'

export const raimond = localFont({
  src: [
    {
      path: './fonts/Raimond-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Raimond-Bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-raimond'
}) 