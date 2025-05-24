'use client';
import dynamic from 'next/dynamic';
const Petfectly = dynamic(() => import('./Dashboard/Petfectly'), {
  ssr: false,
});
export default function Home() {
  return <Petfectly />;
}
