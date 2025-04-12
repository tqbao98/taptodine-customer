'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { menu } = useStore();
  const router = useRouter();

  useEffect(() => {
    router.push('/menu');
  }, [router]);

  return null;
}
