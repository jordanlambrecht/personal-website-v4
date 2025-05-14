import { Space_Mono, Funnel_Sans, Funnel_Display } from 'next/font/google'
import localFont from 'next/font/local'

export const fontFunnelSans = Funnel_Sans({
  subsets: ['latin'],
  // weight: '400',
  variable: '--font-funnel-sans',
  display: 'swap',
  preload: false,
})
export const fontFunnelDisplay = Funnel_Display({
  subsets: ['latin'],
  // weight: '400',
  variable: '--font-funnel-display',
  display: 'swap',
  preload: false,
})

export const fontMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: '400',
  preload: false,
})

export const fontFields = localFont({
  display: 'swap',
  preload: false,
  src: [
    {
      path: './fonts/fields/Fields-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/fields/Fields-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/fields/Fields-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/fields/Fields-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/fields/Fields-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-fields',
})
