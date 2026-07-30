'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { CartItem, MenuItem } from '@/types'
import { useLocale } from '@/lib/locale-context'

interface CartContextType {
  items: CartItem[]
  count: number
  total: number
  isOpen: boolean
  addItem: (item: MenuItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: 0,
  isOpen: false,
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  openCart: () => {},
  closeCart: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale()
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback(
    (menuItem: MenuItem) => {
      const name =
        locale === 'ru'
          ? menuItem.name_ru
          : locale === 'en'
            ? menuItem.name_en
            : menuItem.name_ka

      setItems((prev) => {
        const existing = prev.find((i) => i.id === menuItem.id)
        if (existing) {
          return prev.map((i) =>
            i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        }
        return [
          ...prev,
          {
            id: menuItem.id,
            name,
            price: menuItem.price,
            quantity: 1,
            image_url: menuItem.image_url,
          },
        ]
      })
      setIsOpen(true)
    },
    [locale],
  )

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
      )
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        isOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
