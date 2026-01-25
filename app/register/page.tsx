"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AuthControls } from "@/components/auth/auth-controls";
import { useI18n } from "@/lib/i18n";
import { GraduationCap, University } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [selected, setSelected] = useState<'student' | 'university' | null>(null);

  const handleNext = () => {
    if (selected === 'student') router.push('/register-student');
    if (selected === 'university') router.push('/register-university');
  };

  return (
    <section className="min-h-screen bg-gradient-to-tr from-purple-700 via-purple-800 to-purple-900 flex flex-col items-center justify-center px-4 py-20 text-white relative">
      <AuthControls />

      {/* Header with logo */}
      <Link href="/" className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Grad<span className="text-purple-200">Abroad</span>
        </h1>
      </Link>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{t("auth.register.title")}</h2>
        <p className="text-lg md:text-xl opacity-90 max-w-xl mx-auto">
          {t("auth.register.subtitle")}
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
          <h3 className="text-2xl font-semibold">{t("auth.register.student")}</h3>
          <p className="text-sm max-w-sm">
            {t("auth.register.studentDesc")}
          </p>
        </Card>

        <Card
          onClick={() => setSelected('university')}
          className={`cursor-pointer transition-all duration-300 p-8 rounded-2xl shadow-lg border-4 flex flex-col items-center text-center gap-4 ${
            selected === 'university' ? 'border-white bg-white text-purple-900' : 'border-transparent bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <University size={48} />
          <h3 className="text-2xl font-semibold">{t("auth.register.university")}</h3>
          <p className="text-sm max-w-sm">
            {t("auth.register.universityDesc")}
          </p>
        </Card>
      </div>

      <Button
        disabled={!selected}
        onClick={handleNext}
        className="bg-white text-purple-800 font-semibold px-10 py-4 rounded-xl text-lg hover:bg-gray-100 transition-all disabled:opacity-50"
      >
        {t("auth.register.continue")}
      </Button>
    </section>
  );
}
