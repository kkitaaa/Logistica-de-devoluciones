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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Badge,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../services/api";

export default function EvaluadorTecnico() {
  // Ahora tenemos dos estados separados, uno para cada pestaña
  const [pendientes, setPendientes] = useState([]);
  const [procesadas, setProcesadas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario: { [id]: { resolucion, observacion } }
  const [form, setForm] = useState({});

  const toast = useToast();
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
      setLoading(true);
      
      // Llamamos a los dos nuevos endpoints en paralelo
      const [resPendientes, resProcesadas] = await Promise.all([
        fetch(apiUrl("/api/solicitudes/en-revision"), { headers: obtenerHeaders() }),
        fetch(apiUrl("/api/solicitudes/resueltas-tecnica"), { headers: obtenerHeaders() })
      ]);

      const dataPendientes = await resPendientes.json();
      const dataProcesadas = await resProcesadas.json();

      // Guardamos directamente lo que nos manda el backend
      setPendientes(Array.isArray(dataPendientes) ? dataPendientes : []);
      setProcesadas(Array.isArray(dataProcesadas) ? dataProcesadas : []);
    } catch (err) {
      console.error("Error cargando datos del técnico:", err);
      toast({
        title: "Error de conexión",
        description: "No se pudieron cargar las solicitudes.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setPendientes([]);
      setProcesadas([]);
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

  const registrarEvaluacion = async (id) => {
    const data = form[id];

    if (!data || !data.resolucion) {
      toast({
        title: "Falta el veredicto",
        description: "Debes seleccionar la resolución final del menú desplegable.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      resolucion: data.resolucion,
      observacion: data.observacion || "Sin observaciones adicionales.",
    };

    try {
      const res = await fetch(
        apiUrl(`/api/solicitudes/${id}/evaluacion-tecnica`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...obtenerHeaders(),
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Error en el servidor");
      }

      toast({
        title: "Evaluación registrada",
        description: responseData.mensaje || "Resolución enviada con éxito.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Limpiamos el formulario para ese ID y recargamos la lista
      setForm((prev) => {
        const newForm = { ...prev };
        delete newForm[id];
        return newForm;
      });
      
      // Recargar moverá la tarjeta de "pendientes" a "procesadas" mágicamente
      cargarSolicitudes();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al registrar",
        description: err.message || "Revisa la consola para más información.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#0f0f0f">
        <Spinner size="xl" color="purple.400" />
      </Box>
    );
  }

  return (
    <Box p={8} bg="#0f0f0f" minH="100vh" color="white">
      
      <HStack justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading color="#e0e0e0" size="lg">
            Área de Evaluación Técnica
          </Heading>
          <Text fontSize="sm" color="gray.400">
            Rol: {usuario?.rol || "Técnico"} • Usuario: {usuario?.nombre || "Funcionario"}
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

      <Tabs variant="enclosed" colorScheme="purple">
        <TabList borderColor="#333">
          <Tab _selected={{ color: "white", bg: "#1a1a1a", borderColor: "#333", borderBottomColor: "#1a1a1a" }} color="gray.400">
            Casos en Revisión ({pendientes.length})
          </Tab>
          <Tab _selected={{ color: "white", bg: "#1a1a1a", borderColor: "#333", borderBottomColor: "#1a1a1a" }} color="gray.400">
            Historial Resuelto ({procesadas.length})
          </Tab>
        </TabList>

        <TabPanels bg="#1a1a1a" border="1px solid #333" borderTop="none" borderBottomRadius="lg" p={4}>
          
          {/* PESTAÑA 1: PENDIENTES */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {pendientes.length === 0 ? (
                <Text color="gray.400" textAlign="center" py={6}>
                  No hay casos derivados a evaluación técnica por el momento.
                </Text>
              ) : (
                pendientes.map((s) => (
                  <Card key={s.id_solicitud} bg="#222" border="1px solid #333" borderRadius="md">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold" color="purple.300" fontSize="lg">
                            Solicitud #{s.id_solicitud}
                          </Text>
                          <Badge colorScheme="purple">{s.estado}</Badge>
                        </HStack>

                        <Box bg="#111" p={4} borderRadius="md" border="1px solid #444">
                          <Heading size="xs" color="gray.400" mb={2} textTransform="uppercase">
                            Reporte de Inconsistencia
                          </Heading>
                          <Text fontSize="sm" color="gray.300" mb={2}>
                            <strong>Motivo declarado por el cliente:</strong> {s.motivo}
                          </Text>
                          
                          {s.revision_logistica && (
                            <Box mt={3} p={3} bg="#1a1a1a" borderRadius="md" borderLeft="4px solid orange">
                              <Text fontSize="sm" color="orange.200">
                                <strong>Estado físico real (Logística):</strong> {s.revision_logistica.estado_producto}
                              </Text>
                              {s.revision_logistica.observacion && (
                                <Text fontSize="sm" color="gray.400" mt={1}>
                                  <strong>Nota del operador:</strong> {s.revision_logistica.observacion}
                                </Text>
                              )}
                            </Box>
                          )}
                        </Box>

                        <Divider borderColor="#444" />

                        <Select
                          placeholder="Dictamen / Veredicto Final..."
                          bg="#111"
                          borderColor="#444"
                          color="white"
                          focusBorderColor="purple.400"
                          sx={{ "> option": { background: "#1a1a1a", color: "white" } }}
                          onChange={(e) => handleChange(s.id_solicitud, "resolucion", e.target.value)}
                        >
                          <option value="reemplazo">Reemplazo por unidad nueva</option>
                          <option value="reembolso">Reembolso del dinero</option>
                          <option value="rechazo">Rechazo (Garantía invalidada por mal uso)</option>
                        </Select>

                        <Textarea
                          placeholder="Observaciones técnicas o justificación del veredicto..."
                          bg="#111"
                          borderColor="#444"
                          color="white"
                          focusBorderColor="purple.400"
                          resize="none"
                          rows={3}
                          onChange={(e) => handleChange(s.id_solicitud, "observacion", e.target.value)}
                        />

                        <Button colorScheme="purple" onClick={() => registrarEvaluacion(s.id_solicitud)}>
                          Emitir Resolución Final
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              )}
            </VStack>
          </TabPanel>

          {/* PESTAÑA 2: HISTORIAL RESUELTO */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {procesadas.length === 0 ? (
                <Text color="gray.400" textAlign="center" py={6}>
                  Aún no has emitido resoluciones.
                </Text>
              ) : (
                procesadas.map((s) => (
                  <Card key={s.id_solicitud} bg="#111" border="1px solid #333" borderRadius="md" opacity={0.9}>
                    <CardBody>
                      <VStack align="stretch" spacing={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold" color="gray.300">
                            Solicitud #{s.id_solicitud}
                          </Text>
                          <Badge colorScheme={s.estado === "Rechazada" ? "red" : "green"}>
                            {s.estado}
                          </Badge>
                        </HStack>
                        
                        {s.evaluacion_tecnica && (
                          <Box mt={2}>
                            <Text fontSize="sm" color="gray.300">
                              <strong>Resolución:</strong> {s.evaluacion_tecnica.resolucion}
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                              <strong>Observación técnica:</strong> {s.evaluacion_tecnica.observacion}
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              )}
            </VStack>
          </TabPanel>

        </TabPanels>
      </Tabs>
    </Box>
  );
}