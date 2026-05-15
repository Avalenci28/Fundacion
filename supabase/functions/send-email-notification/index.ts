const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = "Malambo Sonríe <onboarding@resend.dev>";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { type, table, record, old_record } = payload;

    // Verificamos que sea tu tabla de participaciones
    if (type !== "UPDATE" || table !== "participations") {
      return new Response("Evento ignorado", { status: 200 });
    }

    // Solo enviamos correo si el status pasó a 'aprobado' o 'rechazado'
    if (record.status === old_record.status) {
      return new Response("Sin cambios de estado", { status: 200 });
    }

    let subject = "";
    let message = "";

    if (record.status === "aprobado") {
      subject = "¡Bienvenido/a a Malambo Sonríe! 🎉";
      message = `Hola ${record.name}, ¡tu solicitud ha sido aprobada!`;
    } else if (record.status === "rechazado") {
      subject = "Actualización de solicitud - Malambo Sonríe";
      message = `Hola ${record.name}, gracias por tu interés, pero no podemos proceder ahora.`;
    } else {
      return new Response("Estado no relevante", { status: 200 });
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [record.email],
        subject: subject,
        html: `<h2>${subject}</h2><p>${message}</p>`,
      }),
    });

    return new Response("Correo enviado", { status: 200 });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
});