import {
  Badge,
  Box,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";

function colorEstado(estado) {
  switch (estado) {
    case "Aprobada":
    case "Recepcionada":
    case "Reemplazo aprobado":
    case "Reembolso aprobado":
    case "Reparacion aprobada":
      return "green";
    case "Rechazada":
      return "red";
    case "Pendiente":
      return "yellow";
    case "En revision":
      return "purple";
    case "En revisión":
      return "purple";
    default:
      return "gray";
  }
}

export default function MisSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { usuario, obtenerHeaders, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      if (!usuario?.id_cliente) {
        navigate("/login");
        return;
      }

      const res = await fetch(
        apiUrl(`/api/mis-solicitudes/${usuario.id_cliente}`),
        {
          headers: obtenerHeaders(),
        }
      );

      const data = await res.json();

      setSolicitudes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="#0f0f0f"
        color="white"
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
        <Text mt={4}>
          Cargando solicitudes...
        </Text>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="#0f0f0f"
      color="white"
      p={6}
    >
      {/* Barra superior con navegación */}
      <HStack justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading color="#e0e0e0" size="lg">
            Mis Solicitudes
          </Heading>
          <Text fontSize="sm" color="#999">
            {usuario?.nombre}
          </Text>
        </VStack>
        <HStack>
          <Button
            onClick={() => navigate(-1)}
            colorScheme="gray"
            variant="outline"
            size="sm"
          >
            Volver
          </Button>

          <Button
            onClick={() => navigate("/devolucion")}
            colorScheme="blue"
            size="sm"
          >
            Nueva Solicitud
          </Button>
          <Button
            onClick={handleLogout}
            colorScheme="red"
            variant="outline"
            size="sm"
          >
            Cerrar Sesión
          </Button>
        </HStack>
      </HStack>

      {solicitudes.length === 0 ? (
        <Box
          p={6}
          bg="#1a1a1a"
          borderRadius="lg"
          border="1px solid #333"
        >
          <Text color="gray.400">
            No tienes solicitudes registradas.
          </Text>
        </Box>
      ) : (
        <TableContainer
          bg="#1a1a1a"
          borderRadius="lg"
          border="1px solid #333"
        >
          <Table variant="simple">
            <Thead bg="#141414">
              <Tr>
                <Th color="gray.300">ID</Th>
                <Th color="gray.300">Cliente</Th>
                <Th color="gray.300">Pedido</Th>
                <Th color="gray.300">Fecha</Th>
                <Th color="gray.300">Estado</Th>
                <Th color="gray.300">Motivo</Th>
              </Tr>
            </Thead>

            <Tbody>
              {solicitudes.map((s) => (
                <Tr
                  key={s.id_solicitud}
                  _hover={{
                    bg: "#222",
                  }}
                >
                  <Td>
                    #{s.id_solicitud}
                  </Td>

                  <Td>
                    {s.nombre_completo}
                  </Td>

                  <Td>
                    #{s.id_pedido}
                  </Td>

                  <Td>
                    {new Date(
                      s.fecha
                    ).toLocaleDateString()}
                  </Td>

                  <Td>
                    <Badge
                      colorScheme={colorEstado(
                        s.estado
                      )}
                    >
                      {s.estado}
                    </Badge>
                  </Td>

                  <Td maxW="350px">
                    {s.motivo}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
