import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Textarea,
  useToast,
  HStack,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    case "En revisión":
      return "purple";
    default:
      return "gray";
  }
}

export default function SolicitudDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { usuario, obtenerHeaders, logout } = useAuth();
  
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardandoRevision, setGuardandoRevision] = useState(false);
  const [guardandoEvaluacion, setGuardandoEvaluacion] = useState(false);
  const [revisionForm, setRevisionForm] = useState({
    estado_producto: "defectuoso",
    observacion: "",
  });
  const [evaluacionForm, setEvaluacionForm] = useState({
    resolucion: "reemplazo",
    observacion: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cargar = async () => {
    setLoading(true);

    try {
      const res = await fetch(apiUrl(`/api/solicitudes/${id}`), {
        headers: obtenerHeaders(),
      });
      const data = await res.json();
      setSolicitud(data);
    } catch (err) {
      console.error(err);
      setSolicitud(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [id]);

  const guardarRevision = async (e) => {
    e.preventDefault();
    setGuardandoRevision(true);

    try {
      const res = await fetch(apiUrl(`/api/solicitudes/${id}/revision-logistica`), {
        method: "POST",
        headers: obtenerHeaders(),
        body: JSON.stringify(revisionForm),
      });
      const data = await res.json();
      toast({
        title: data.mensaje,
        status: res.ok ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
      if (res.ok) {
        await cargar();
        setRevisionForm({ estado_producto: "defectuoso", observacion: "" });
      }
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setGuardandoRevision(false);
    }
  };

  const guardarEvaluacion = async (e) => {
    e.preventDefault();
    setGuardandoEvaluacion(true);

    try {
      const res = await fetch(apiUrl(`/api/solicitudes/${id}/evaluacion-tecnica`), {
        method: "POST",
        headers: obtenerHeaders(),
        body: JSON.stringify(evaluacionForm),
      });
      const data = await res.json();
      toast({
        title: data.mensaje,
        status: res.ok ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
      if (res.ok) {
        await cargar();
        setEvaluacionForm({ resolucion: "reemplazo", observacion: "" });
      }
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setGuardandoEvaluacion(false);
    }
  };

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

  const revision = solicitud.revision_logistica;
  const evaluacion = solicitud.evaluacion_tecnica;
  const solicitudRechazada = solicitud.estado === "Rechazada";

  return (
    <Box minH="100vh" bg="#0f0f0f" color="white" p={6}>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading color="#e0e0e0" size="lg">
            Solicitud #{solicitud.id_solicitud}
          </Heading>
          <Text fontSize="sm" color="gray.400">
            Rol: {usuario?.rol} • Usuario: {usuario?.nombre}
          </Text>
        </VStack>

        <HStack>
          <Button onClick={() => navigate(-1)} colorScheme="gray" variant="outline" size="sm">
            Volver
          </Button>
          <Button onClick={handleLogout} colorScheme="red" variant="outline" size="sm">
            Cerrar Sesión
          </Button>
        </HStack>
      </HStack>

      <Box maxW="1000px" mx="auto">
        <Box
          bg="#1a1a1a"
          p={6}
          borderRadius="12px"
          border="1px solid #2a2a2a"
          boxShadow="0 0 20px rgba(0,0,0,0.6)"
        >
          <HStack mb={4} spacing={4}>
            <Heading size="lg">Detalles de Solicitud</Heading>
            <Badge colorScheme={colorEstado(solicitud.estado)}>
              {solicitud.estado}
            </Badge>
          </HStack>

          <Divider my={4} borderColor="#333" />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Stack spacing={3}>
              <Text>
                <b>Cliente:</b> {solicitud.nombre_completo || "Sin cliente"}
              </Text>
              <Text>
                <b>Telefono:</b> {solicitud.numero_telefonico || "Sin telefono"}
              </Text>
              <Text>
                <b>Pedido:</b> #{solicitud.id_pedido}
              </Text>
              <Text>
                <b>Fecha solicitud:</b>{" "}
                {new Date(solicitud.fecha).toLocaleDateString()}
              </Text>
            </Stack>

            <Stack spacing={3}>
              <Text>
                <b>Motivo declarado:</b>
              </Text>
              <Text color="gray.300">{solicitud.motivo}</Text>
            </Stack>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
}
