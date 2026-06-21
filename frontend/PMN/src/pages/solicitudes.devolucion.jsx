import {
  Badge,
  Button,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerSolicitudes } from "../services/solicitudes";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../services/api";

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

export default function Solicitudes() {
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
      const res = await fetch(apiUrl("/api/solicitudes"), {
        headers: obtenerHeaders(),
      });
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
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
        <Text mt={3}>Cargando solicitudes...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} minH="100vh" bg="#0f0f0f" color="white">

      <HStack justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading color="#e0e0e0" size="lg">
            Solicitudes de devolución
          </Heading>
          <Text fontSize="sm" color="gray.400">
            Rol: {usuario?.rol} • Total: {solicitudes.length}
          </Text>
        </VStack>

        <Button
          onClick={handleLogout}
          colorScheme="red"
          variant="outline"
          size="sm"
        >
          Cerrar Sesión
        </Button>
      </HStack>

      <TableContainer
        border="1px solid #2a2a2a"
        borderRadius="lg"
        overflow="hidden"
        bg="#1a1a1a"
      >
        <Table variant="simple" size="sm">

          <Thead bg="#141414">
            <Tr>
              <Th color="gray.300">ID</Th>
              <Th color="gray.300">Cliente</Th>
              <Th color="gray.300">Pedido</Th>
              <Th color="gray.300">Fecha</Th>
              <Th color="gray.300">Estado</Th>
              <Th color="gray.300">Motivo</Th>
              <Th color="gray.300">Acción</Th>
            </Tr>
          </Thead>

          <Tbody>
            {solicitudes.map((s) => (
              <Tr
                key={s.id_solicitud}
                _hover={{ bg: "#222222" }}
                transition="0.2s"
              >
                <Td fontWeight="bold">#{s.id_solicitud}</Td>

                <Td>{s.nombre_completo}</Td>

                <Td color="gray.400">#{s.id_pedido}</Td>

                <Td>
                  {new Date(s.fecha).toLocaleDateString()}
                </Td>

                <Td>
                  <Badge
                    px={2}
                    py={1}
                    borderRadius="md"
                    colorScheme={colorEstado(s.estado)}
                  >
                    {s.estado}
                  </Badge>
                </Td>

                <Td maxW="250px" isTruncated>
                  {s.motivo}
                </Td>

                <Td>
                  <Button size="xs" colorScheme="blue" onClick={() => navigate(`/solicitudes/${s.id_solicitud}`)}>
                    Ver
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>

        </Table>
      </TableContainer>
    </Box>
  );
}
