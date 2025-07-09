"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap, University } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<'student' | 'university' | null>(null);

  const handleNext = () => {
    if (selected === 'student') router.push('/register-student');
    if (selected === 'university') router.push('/register-university');
  };

  return (
    <section className="min-h-screen bg-gradient-to-tr from-purple-700 via-purple-800 to-purple-900 flex flex-col items-center justify-center px-4 py-20 text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Choose Your Path</h1>
        <p className="text-lg md:text-xl opacity-90 max-w-xl mx-auto">
          Are you a student looking to study abroad or a university aiming to collaborate?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
        <Card
          onClick={() => setSelected('student')}
          className={`cursor-pointer transition-all duration-300 p-8 rounded-2xl shadow-lg border-4 flex flex-col items-center text-center gap-4 ${
            selected === 'student' ? 'border-white bg-white text-purple-900' : 'border-transparent bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <GraduationCap size={48} />
          <h3 className="text-2xl font-semibold">Student Account</h3>
          <p className="text-sm max-w-sm">
            Start your journey toward international education with personalized support and guidance.
          </p>
        </Card>

        <Card
          onClick={() => setSelected('university')}
          className={`cursor-pointer transition-all duration-300 p-8 rounded-2xl shadow-lg border-4 flex flex-col items-center text-center gap-4 ${
            selected === 'university' ? 'border-white bg-white text-purple-900' : 'border-transparent bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <University size={48} />
          <h3 className="text-2xl font-semibold">University Account</h3>
          <p className="text-sm max-w-sm">
            Partner with us to reach thousands of talented students seeking global opportunities.
          </p>
        </Card>
      </div>

      <Button
        disabled={!selected}
        onClick={handleNext}
        className="bg-white text-purple-800 font-semibold px-10 py-4 rounded-xl text-lg hover:bg-gray-100 transition-all disabled:opacity-50"
      >
        Continue
      </Button>
    </section>
  );
}
