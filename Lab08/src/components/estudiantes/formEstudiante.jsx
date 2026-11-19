function FormularioEstudiante({
  form,
  onChange,
  onSubmit,
  onCancel,
}) {
  const isEditing = Boolean(form.id);

  return (
    <div>
      <h2>{isEditing ? "Editar estudiante" : "Agregar estudiante"}</h2>

      <form onSubmit={onSubmit}>
        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={onChange}
          />

          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={onChange}
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={onChange}
          />

          <input
            type="text"
            name="carrera"
            placeholder="Carrera"
            value={form.carrera}
            onChange={onChange}
          />

          <input
            type="date"
            name="fechaNac"
            value={form.fechaNac}
            onChange={onChange}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button type="submit">
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioEstudiante;