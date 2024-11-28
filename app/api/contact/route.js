import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(req) {
  const { email, message } = await req.json();
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'ntqjcontacto@gmail.com',
    subject: 'Nuevo mensaje SCREEN.NET',
    html: `El correo electronico ${email} quiere tener mas informacion acerca de nuestro producto<br/> <strong>Escribio el siguiente mensaje</strong>:\n\n${message}`,
  });

  if (error) {
    return Response.json({ error });
  }

  return Response.json(data);
}