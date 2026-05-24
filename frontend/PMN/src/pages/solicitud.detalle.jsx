import {
  Box,
  Badge,
  Heading,
  Text,
  Spinner,
  Divider,
  Stack,
  Button,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function SolicitudDetalle() {
  const { id } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerSolicitudPorId(id);
        setSolicitud(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="#0f0f0f"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="white" />
      </Box>
    );
  }

  if (!solicitud) {
    return (
      <Box minH="100vh" bg="#0f0f0f" color="white" p={10}>
        <Text>No existe esta solicitud</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="#0f0f0f" color="white" p={10}>
      <Box
        maxW="750px"
        mx="auto"
        bg="#1a1a1a"
        p={6}
        borderRadius="12px"
        border="1px solid #2a2a2a"
        boxShadow="0 0 20px rgba(0,0,0,0.6)"
      >
        <Heading mb={4}>
          Solicitud #{solicitud.id_solicitud}
        </Heading>

        <Badge colorScheme={colorEstado(solicitud.estado)} mb={4}>
          {solicitud.estado}
        </Badge>

        <Divider my={4} borderColor="#333" />

        <Stack spacing={3}>
          <Text>
            <b>Cliente:</b> {solicitud.nombre_completo}
          </Text>

          <Text>
            <b>Teléfono:</b> {solicitud.numero_telefonico}
          </Text>

          <Text>
            <b>Pedido:</b> #{solicitud.id_pedido}
          </Text>

          <Text>
            <b>Fecha pedido:</b> {solicitud.fecha}
          </Text>

          <Text>
            <b>Monto total:</b>{" "}
            ${Number(solicitud.monto_total).toLocaleString()}
          </Text>

          <Divider borderColor="#333" />

          <Text>
            <b>Motivo:</b>
          </Text>

          <Text color="gray.300">
            {solicitud.motivo}
          </Text>
        </Stack>

        <Button mt={6} w="100%" colorScheme="blue">
          Actualizar estado
        </Button>
      </Box>
    </Box>
  );
}