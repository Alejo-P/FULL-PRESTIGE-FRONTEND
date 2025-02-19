import { render, screen, fireEvent } from "@testing-library/react";
import { TablaUsuarios } from "../src/components/Usuarios/TablaUsuarios";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../src/context/AuthProvider";
import { HistoryContext } from "../src/context/HistoryContext";
import { useNavigate } from "react-router-dom";

// Mock de useNavigate antes de las pruebas
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("TablaUsuarios", () => {
  const mockNavigate = useNavigate;  // useNavigate ahora es un mock

  const usuarios = [
    {
      cedula: "1234567890",
      nombre: "Juan Pérez",
      telefono: "0987654321",
      correo: "juan@example.com",
      direccion: "Av. Siempre Viva 123",
      cargo: "Técnico",
      estado: "Activo",
    },
    {
      cedula: "0987654321",
      nombre: "María López",
      telefono: "0987654321",
      correo: "maria@example.com",
      direccion: "Calle Falsa 456",
      cargo: "Administrador",
      estado: "Inactivo",
    },
  ];

  const mockSetSeleccionado = jest.fn();

  const renderComponent = (auth) => {
    render(
      <AuthContext.Provider value={{ auth }}>
        <HistoryContext.Provider value={{
          seleccionado: null,
          setSeleccionado: mockSetSeleccionado,
        }}>
          <MemoryRouter>
            <TablaUsuarios usuarios={usuarios} />
          </MemoryRouter>
        </HistoryContext.Provider>
      </AuthContext.Provider>
    );
  };

  it("debería renderizar los encabezados correctamente", () => {
    renderComponent({ cargo: "Administrador" });

    const headers = [
      "Cédula",
      "Nombre y Apellido",
      "Telefono",
      "Email",
      "Dirección",
      "Cargo",
      "Estado",
      "Opciones",
    ];

    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("debería mostrar la columna 'Opciones' solo para administradores", () => {
    renderComponent({ cargo: "Técnico" });
    expect(screen.queryByText("Opciones")).not.toBeInTheDocument();

    renderComponent({ cargo: "Administrador" });
    expect(screen.getByText("Opciones")).toBeInTheDocument();
  });

  it("debería manejar el clic en una fila y actualizar el contexto", () => {
    renderComponent({ cargo: "Administrador" });

    const row = screen.getByText("Juan Pérez").closest("tr");
    fireEvent.click(row);

    expect(mockSetSeleccionado).toHaveBeenCalledWith(usuarios[0]);
  });

  
});
