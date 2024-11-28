'use client'
import { useState } from "react";

export default function Contacto() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message }),
    });

    if (res.ok) {
      setStatus("Mensaje enviado correctamente. Gracias por contactarnos.");
      setEmail("");
      setMessage("");
    } else {
      setStatus("Hubo un error. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-100 shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-600">Contáctanos</h1>
        <p className="mt-4 text-center text-gray-600">¿Tienes alguna consulta?<br/> Envíanos un mensaje y nos contactaremos a la brevedad.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700">Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 placeholder-gray-700 bg-indigo-300 border border-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Escribe tu mail de contacto aquí..."
            />
          </div>
          <div>
            <label className="block text-gray-700">Mensaje:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 placeholder-gray-700 bg-indigo-300 border border-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Escribe tu mensaje aquí..."
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          >
            Enviar mensaje
          </button>
        </form>
        {status && <p className="mt-4 text-center text-gray-600">{status}</p>}
      </div>
    </div>
  );
}