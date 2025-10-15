"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BASE_URL, saveAuthToStorage } from "@/lib/auth";

interface RegisterForm {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
}

export default function RegisterStudentPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Email noto'g'ri formatda.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register/student/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data?.detail === "string" ? data.detail : "Ro'yxatdan o'tishda xatolik.";
        toast.error(msg);
        return;
      }

      // Ba'zi backendlar ro'yxatdan o'tganda token ham yuborishi mumkin
      saveAuthToStorage(data);
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz. Kirish sahifasiga yo'naltirilmoqda...");
      router.push("/login/student");
    } catch {
      toast.error("Server xatosi. Keyinroq urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900 text-white px-4 py-16">
      <div className="max-w-md w-full">
        <Card className="bg-white text-black">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Talaba ro'yxatdan o'tish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Ism"
              value={form.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
            <Input
              placeholder="Familiya"
              value={form.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
            <Input
              placeholder="Telefon (+998...)"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              placeholder="Parol"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Button disabled={loading} onClick={handleSubmit} className="w-full">
              {loading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
