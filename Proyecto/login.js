import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Credenciales  de Supabase
const SUPABASE_URL = "https://ypnkyhjuiaubmpfzprlh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwbmt5aGp1aWF1Ym1wZnpwcmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MjA4OTEsImV4cCI6MjEwODE5Njg5MX0.YpZABNNXWf700SVkaeeVaXw8pf-giw9ZV4sIjmgZB3A";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        Swal.fire({
            title: 'Campos vacíos',
            text: 'Por favor ingresa tu correo y contraseña.',
            icon: 'warning',
            confirmButtonColor: '#ff66c4'
        });
        return;
    }

    try {
        // Autenticación nativa recomendada por Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // Si el login es exitoso
        Swal.fire({
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión correctamente.',
            icon: 'success',
            confirmButtonColor: '#ff66c4',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            // Redirigir al usuario a la página principal o panel
            window.location.href = 'index.html';
        });

    } catch (error) {
        console.error('Error detallado en login:', error);
        Swal.fire({
            title: 'Error de Acceso',
            text: error.message, // <-- mostrar el mensaje exacto que envía Supabase
            icon: 'error',
            confirmButtonColor: '#ff66c4'
        });
    }
});