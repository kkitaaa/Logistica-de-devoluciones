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
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { obtenerSolicitudes } from "../services/solicitudes";

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

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const data = await obtenerSolicitudes();
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
        <Heading size="lg">
          Solicitudes de devolución
        </Heading>

        <Text fontSize="sm" color="gray.400">
          Total: {solicitudes.length}
        </Text>
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

                <Td>{s.cliente}</Td>

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
                  <Button size="xs" colorScheme="blue">
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