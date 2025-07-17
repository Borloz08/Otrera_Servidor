document.getElementById("registro-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const pais = document.getElementById("pais").value;
  const telefono = document.getElementById("telefono").value;

  const response = await fetch("/api/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre, pais, telefono })
  });

  const mensaje = document.getElementById("mensaje");
  if (response.ok) {
    mensaje.textContent = "✅ Registro exitoso. En breve recibirás un mensaje por WhatsApp.";
    mensaje.style.color = "lightgreen";
  } else {
    mensaje.textContent = "❌ Error al registrar. Inténtalo de nuevo.";
    mensaje.style.color = "red";
  }
});
