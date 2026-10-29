import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Configuración de Supabase con las credenciales correctas del laboratorio
const SUPABASE_URL = "https://ypnkyhjuiaubmpfzprlh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwbmt5aGp1aWF1Ym1wZnpwcmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MjA4OTEsImV4cCI6MjEwODE5Njg5MX0.YpZABNNXWf700SVkaeeVaXw8pf-giw9ZV4sIjmgZB3A";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Capturamos el envío del formulario de contacto
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitamos que recargue la página por defecto

    // Obtenemos los valores de los inputs usando sus IDs exactos
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    // Validamos que no vayan vacíos
    if (!nombre || !correo || !mensaje) {
        Swal.fire({
            title: 'Campos incompletos',
            text: 'Por favor llena todos los campos del formulario.',
            icon: 'warning',
            confirmButtonColor: '#ff66c4'
        });
        return;
    }

    try {
        // Insertamos los datos en la tabla mensaje_contacto que creamos en Supabase
        const { data, error } = await supabase
            .from('mensaje_contacto')
            .insert([
                { 
                    nombre: nombre, 
                    correo: correo, 
                    mensaje: mensaje 
                }
            ]);

        if (error) throw error;

        // Mensaje de éxito elegante con SweetAlert2
        Swal.fire({
            title: '¡Mensaje enviado!',
            text: 'Gracias por ponerte en contacto con DEY Online Store. Te responderemos pronto.',
            icon: 'success',
            confirmButtonColor: '#ff66c4'
        });

        // Limpiamos el formulario después de enviar con éxito
        document.querySelector('form').reset();

    } catch (error) {
        console.error('Error al guardar el mensaje:', error.message);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo enviar tu mensaje. Inténtalo de nuevo más tarde.',
            icon: 'error',
            confirmButtonColor: '#ff66c4'
        });
    }
});