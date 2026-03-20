'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { CartItem, Product } from '@/lib/types'

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, size: string) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, qty: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number // in cents
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('urban_cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // ignore parse errors
    }
    setMounted(true)
  }, [])

  // Persist to localStorage whenever items change (after mount)
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('urban_cart', JSON.stringify(items))
  }, [items, mounted])

  const addItem = useCallback((product: Product, size: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.selectedSize === size
      )
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedSize === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, quantity: 1, selectedSize: size }]
    })
    setIsDrawerOpen(true)
  }, [])

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.selectedSize === size))
    )
  }, [])

  const updateQuantity = useCallback((productId: string, size: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) =>
        prev.filter((i) => !(i.product.id === productId && i.selectedSize === size))
      )
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId && i.selectedSize === size ? { ...i, quantity: qty } : i
        )
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem('urban_cart')
  }, [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount: mounted ? itemCount : 0,
        subtotal,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
