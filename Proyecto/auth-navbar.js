import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = "https://ypnkyhjuiaubmpfzprlh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwbmt5aGp1aWF1Ym1wZnpwcmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MjA4OTEsImV4cCI6MjEwODE5Njg5MX0.YpZABNNXWf700SVkaeeVaXw8pf-giw9ZV4sIjmgZB3A";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verificarSesionNavbar() {
    const navAuthArea = document.getElementById('navAuthArea');
    if (!navAuthArea) return;

    // 1. Obtener usuario actual en sesión
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // 2. Buscar el nombre y rol en la tabla public.usuarios
        const { data: perfil } = await supabase
            .from('usuarios')
            .select('nombre, rol')
            .eq('id', user.id)
            .single();

        const nombreUsuario = perfil ? perfil.nombre : 'Mi Cuenta';

        // 3. Pintar el menú desplegable del usuario autenticado
        navAuthArea.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-white fw-semibold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle me-1"></i> Hola, ${nombreUsuario}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    ${perfil?.rol === 'admin' ? '<li><a class="dropdown-item" href="admin.html"><i class="bi bi-speedometer2 me-2"></i>Panel Admin</a></li>' : ''}
                    <li><button class="dropdown-item text-danger" id="btnCerrarSesion"><i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</button></li>
                </ul>
            </li>
        `;

        // 4. Asignar evento al botón de cerrar sesión
        document.getElementById('btnCerrarSesion').addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.reload(); // Recarga la página para actualizar el menú
        });
    }
}

verificarSesionNavbar();