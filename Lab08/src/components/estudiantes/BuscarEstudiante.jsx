function BuscadorEstudiante({
  search = "",
  onSearchChange,
  onSearch,
  onClearSearch,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div>
      <h2>Consulta de estudiantes</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button type="button" onClick={onSearch} className="btn btn-primary">
          Buscar
        </button>
        <button
          type="button"
          onClick={onClearSearch}
          className="btn btn-secondary"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}

export default BuscadorEstudiante;