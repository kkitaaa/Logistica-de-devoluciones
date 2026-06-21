import {
  Box,
  Heading,
  VStack,
  Card,
  CardBody,
  Text,
  Button,
  Select,
  Textarea,
  useToast,
  Spinner,
  Divider,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../services/api";

export default function OperadorSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  // estado por solicitud:
  // { [id]: { estado, observacion } }
  const [form, setForm] = useState({});

  const toast = useToast();
  const { obtenerHeaders } = useAuth();

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);

      const res = await fetch(apiUrl("/api/solicitudes"), {
        headers: obtenerHeaders(),
      });

      const data = await res.json();

      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const registrarEstado = async (id) => {
    const data = form[id];

    if (!data?.estado) {
      toast({
        title: "Falta estado del producto",
        status: "warning",
      });
      return;
    }

    try {
      const res = await fetch(
        apiUrl(`/api/solicitudes/${id}/revision-logistica`),
        {
          method: "POST",
          headers: {
            ...obtenerHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado_producto: data.estado,
            observacion: data.observacion || null,
          }),
        }
      );

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text);
      }

      toast({
        title: "Recepción registrada",
        status: "success",
      });

      cargarSolicitudes();
    } catch (err) {
      console.error(err);

      toast({
        title: "Error al registrar",
        description: "Revisa consola para más info",
        status: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="#0f0f0f"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={8} bg="#0f0f0f" minH="100vh" color="white">
      <Heading mb={6}>Operador Logístico</Heading>

      <VStack spacing={6} align="stretch">
        {solicitudes.length === 0 && (
          <Text color="gray.400">
            No hay solicitudes disponibles
          </Text>
        )}

        {solicitudes.map((s) => (
          <Card
            key={s.id_solicitud}
            bg="#1a1a1a"
            border="1px solid #2a2a2a"
            borderRadius="lg"
          >
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <Text fontWeight="bold" color="white">
                  Solicitud #{s.id_solicitud}
                </Text>

                <Text fontSize="sm" color="gray.400">
                  Motivo: {s.motivo}
                </Text>

                <Divider borderColor="#333" />

                <Select
                  placeholder="Estado físico del producto"
                  bg="#111"
                  borderColor="#333"
                  textColor="gray.400"
                  onChange={(e) =>
                    handleChange(s.id_solicitud, "estado", e.target.value)
                  }
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                  <option value="dañado">Danado</option>
                  <option value="defectuoso">Defectuoso</option>
                </Select>

                <Textarea
                  placeholder="Observación (opcional)"
                  bg="#111"
                  borderColor="#333"
                  onChange={(e) =>
                    handleChange(
                      s.id_solicitud,
                      "observacion",
                      e.target.value
                    )
                  }
                />

                <Button
                  colorScheme="orange"
                  onClick={() => registrarEstado(s.id_solicitud)}
                >
                  Registrar recepción
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
}