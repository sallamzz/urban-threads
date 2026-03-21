import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { UserProvider } from '@/context/UserContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { OnboardingModal } from '@/components/ui/Modal'
import { ToastContainer } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'UrbanThreads — Modern Fashion',
  description: 'Premium clothing for the modern wardrobe. Earn loyalty points on every purchase.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <OnboardingModal />
            <main className="min-h-screen animate-fade-up">{children}</main>
            <Footer />
            <ToastContainer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  )
}
