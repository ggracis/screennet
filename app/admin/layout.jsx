"use client";
import { useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import useAuthStore from "@/stores/useAuthStore";
import Navbar from "@/components/admin/navbar";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const { user, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="flex bg-background">
      <Navbar />

      <div className="flex flex-col flex-1">
        <header className="h-16 border-b flex items-center px-6">
          <Link href="/admin">
            <h1 className="text-2xl font-bold my-6">ScreenNet</h1>
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
