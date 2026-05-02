"use client";

import { useStockStore } from '@/store/useStockStore';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const isLoggedIn = useStockStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Login />;
  }

  return <Dashboard />;
}
