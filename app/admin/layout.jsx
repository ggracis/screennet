"use client";
import { useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import useAuthStore from "@/stores/useAuthStore";
import Navbar from "@/components/admin/navbar";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

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

      <div className="flex flex-col flex-1">{children}</div>
      <Toaster />
    </div>
  );
}
