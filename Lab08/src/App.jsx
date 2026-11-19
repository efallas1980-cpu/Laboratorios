import { useEffect, useState } from "react";
import {
  obtenerEstudiantes,
  guardarEstudiante,
  eliminarEstudiante,
} from "./estudianteService";
import FormularioEstudiante from "./components/estudiantes/FormEstudiante";
import BuscadorEstudiante from "./components/estudiantes/BuscarEstudiante";
import TablaEstudiante from "./components/estudiantes/TablaEstudiante";

const initialForm = {
  id: "",
  nombre: "",
  apellido: "",
  correo: "",
  carrera: "",
  fechaNac: "",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStudents = async (searchText = "") => {
    try {
      setLoading(true);
      const data = await obtenerEstudiantes(searchText);
      setStudents(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !form.nombre.trim() ||
        !form.apellido.trim() ||
        !form.correo.trim() ||
        !form.carrera.trim()
      ) {
        alert("Debe completar nombre, apellido, correo y carrera");
        return;
      }

      await guardarEstudiante(form);
      setForm(initialForm);
      await loadStudents(search);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEdit = (student) => {
    setForm({
      id: student.id || "",
      nombre: student.nombre || "",
      apellido: student.apellido || "",
      correo: student.correo || "",
      carrera: student.carrera || "",
      fechaNac: student.fechaNac || "",
    });
  };

  const handleDelete = async (id) => {
    const ok = confirm("¿Desea eliminar este estudiante?");
    if (!ok) return;

    try {
      await eliminarEstudiante(id);
      await loadStudents(search);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
  };

  const handleSearch = async () => {
    await loadStudents(search);
  };

  const handleClearSearch = async () => {
    setSearch("");
    await loadStudents("");
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <h1>Laboratorio 8 - React LMS</h1>
      <p>Introducción a React con separación de responsabilidades.</p>

      <hr />

      <FormularioEstudiante
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <hr />

      <BuscadorEstudiante
        search={search}
        onSearchChange={setSearch}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
      />

      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : (
        <TablaEstudiante
          students={students}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;