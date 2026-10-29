import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Credenciales  de Supabase
const SUPABASE_URL = "https://ypnkyhjuiaubmpfzprlh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwbmt5aGp1aWF1Ym1wZnpwcmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MjA4OTEsImV4cCI6MjEwODE5Njg5MX0.YpZABNNXWf700SVkaeeVaXw8pf-giw9ZV4sIjmgZB3A";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para obtener y mostrar los mensajes
async function obtenerMensajes() {
    const tbody = document.getElementById('tbodyMensajes');
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">Cargando mensajes...</td></tr>`;

    try {
        // Consultamos la tabla ordenados del más reciente al más antiguo
        const { data, error } = await supabase
            .from('mensaje_contacto')
            .select('*')
            .order('fecha_envio', { ascending: false });

        if (error) throw error;

        // Si no hay mensajes
        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">No hay mensajes registrados todavía.</td></tr>`;
            return;
        }

        // Limpiamos y rellenamos la tabla con los datos
        tbody.innerHTML = '';
        data.forEach(msg => {
            // Formatear la fecha forzando la zona horaria de Costa Rica y un formato limpio
            let fechaFormateada = 'Fecha no disponible';
            if (msg.fecha_envio) {
                const fechaObj = new Date(msg.fecha_envio);
                
                const opciones = {
                    timeZone: 'America/Costa_Rica', // Forzamos la zona horaria correcta
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // Formato de 24 horas (puedes cambiarlo a true si prefieres am/pm)
                };
                
                fechaFormateada = new Intl.DateTimeFormat('es-CR', opciones).format(fechaObj);
            }

            const fila = `
                <tr>
                    <td class="ps-3 fw-semibold">${escapeHtml(msg.nombre)}</td>
                    <td><a href="mailto:${escapeHtml(msg.correo)}" class="text-decoration-none">${escapeHtml(msg.correo)}</a></td>
                    <td>${escapeHtml(msg.mensaje)}</td>
                    <td class="text-muted small">${fechaFormateada}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });

    } catch (error) {
        console.error('Error al cargar mensajes:', error.message);
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-danger">Error al cargar los mensajes desde la base de datos.</td></tr>`;
        Swal.fire('Error', 'No se pudieron cargar los mensajes.', 'error');
    }
}

// Función  de seguridad para que se escriba codigo malicioso en la tabla de mensajes
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Cargar los mensajes al abrir la página
document.addEventListener('DOMContentLoaded', obtenerMensajes);

// Botón de actualizar
document.getElementById('btnActualizar').addEventListener('click', obtenerMensajes);