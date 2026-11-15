import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Tus credenciales funcionales de Supabase
const SUPABASE_URL = "https://ypnkyhjuiaubmpfzprlh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwbmt5aGp1aWF1Ym1wZnpwcmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MjA4OTEsImV4cCI6MjEwODE5Njg5MX0.YpZABNNXWf700SVkaeeVaXw8pf-giw9ZV4sIjmgZB3A";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!nombre || !email || !password) {
        Swal.fire({
            title: 'Campos incompletos',
            text: 'Por favor llena todos los campos.',
            icon: 'warning',
            confirmButtonColor: '#ff66c4'
        });
        return;
    }

    try {
        // 1. Registrar usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) throw authError;

        // Obtenemos el ID único generado por Supabase para este usuario
        const userId = authData.user?.id;

        if (userId) {
            // 2. Insertar el registro en tu tabla pública `usuarios` con el rol de 'cliente'
            const { error: dbError } = await supabase
                .from('usuarios')
                .insert([
                    { 
                        id: userId, // Vinculamos con el ID de Auth
                        nombre: nombre,
                        correo: email,
                        rol: 'cliente' // Rol predeterminado para nuevos registros
                    }
                ]);

            if (dbError) {
                console.error('Advertencia al guardar perfil en tabla usuarios:', dbError.message);
            }
        }

        // Éxito
        Swal.fire({
            title: '¡Registro exitoso!',
            text: 'Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.',
            icon: 'success',
            confirmButtonColor: '#ff66c4',
            confirmButtonText: 'Ir al Login'
        }).then(() => {
            window.location.href = 'login.html';
        });

    } catch (error) {
        console.error('Error en el registro:', error.message);
        Swal.fire({
            title: 'Error en el registro',
            text: error.message || 'No se pudo crear la cuenta. Inténtalo de nuevo.',
            icon: 'error',
            confirmButtonColor: '#ff66c4'
        });
    }
});