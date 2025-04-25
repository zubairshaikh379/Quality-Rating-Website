'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert('👋 Logged out!');
  };

  return (
    <nav className="w-full px-6 py-4 bg-zinc-900 text-white shadow-md flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-rose-400">QualityPredict</Link>

      <div className="flex gap-4 items-center">
        <Link href="/home" className="hover:text-rose-300">Home</Link>
        <Link href="/predict" className="hover:text-rose-300">Predict</Link>
        <Link href="/dashboard" className="hover:text-rose-300">Dashboard</Link>
        <Link href="/contact" className="hover:text-rose-300">Contact</Link>

        {!user ? (
          <Link href="/auth" className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-1 rounded-md">
            Login / Register
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
