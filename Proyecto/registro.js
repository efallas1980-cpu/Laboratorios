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
    const passwordConfirm = document.getElementById('passwordConfirm').value.trim(); // <-- Campo de confirmación

    if (!nombre || !email || !password || !passwordConfirm) {
        Swal.fire({
            title: 'Campos incompletos',
            text: 'Por favor llena todos los campos.',
            icon: 'warning',
            confirmButtonColor: '#ff66c4'
        });
        return;
    }

    // Validar si las contraseñas coinciden
    if (password !== passwordConfirm) {
        Swal.fire({
            title: 'Las contraseñas no coinciden',
            text: 'Por favor verifica que la contraseña y su confirmación sean idénticas.',
            icon: 'error',
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

        // ID único generado por Supabase para este usuario
        const userId = authData.user?.id;

        if (userId) {
            // 2. Insertar el registro incluyendo password_hash 
            const { error: dbError } = await supabase
                .from('usuarios')
                .insert([
                    { 
                        id_usuario: userId, 
                        nombre: nombre,
                        correo: email,
                        password_hash: 'auth_supabase', // Evita errores si la columna es obligatoria
                        rol: 'cliente' 
                    }
                ]);

            if (dbError) {
                console.error('Error detallado al guardar en tabla usuarios:', dbError.message);
                alert('Error al guardar perfil: ' + dbError.message);
                return;
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