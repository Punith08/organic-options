import type { AppProps } from 'next/app'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <WishlistProvider>
        <Component {...pageProps} />
      </WishlistProvider>
    </CartProvider>
  )
}
