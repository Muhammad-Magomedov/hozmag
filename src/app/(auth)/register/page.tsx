import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Регистрация" };

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Регистрация</h1>
        <p className="text-sm text-muted-foreground">
          Создайте аккаунт покупателя
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
