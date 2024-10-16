"use client";
import { useState } from "react";
import useAuthStore from "@/stores/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(identifier, password);
  };

  return (
    <>
      <Card className="w-[40vw] mx-auto mt-8 mb-8">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="identifier">Usuario</Label>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginForm;
