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
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function colorEstado(estado) {
  switch (estado) {
    case "Aprobada":
      return "green";
    case "Rechazada":
      return "red";
    case "Pendiente":
      return "yellow";
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

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const usuario = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      if (!usuario?.id) {
        navigate("/login");
        return;
      }

      const res = await fetch(
        `http://localhost:3000/api/mis-solicitudes/${usuario.id}`
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
      <Heading mb={6}>
        Mis Solicitudes
      </Heading>

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