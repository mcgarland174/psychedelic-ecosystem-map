'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/change-pathways');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#FBF3E7' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
        <p className="text-base font-medium" style={{ color: '#4A4643' }}>Redirecting...</p>
      </div>
    </div>
  );
}
