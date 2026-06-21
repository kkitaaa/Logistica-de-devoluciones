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
  Checkbox, // <-- Importamos Checkbox
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../services/api";

export default function OperadorSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

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
        title: "Falta el estado físico",
        description: "Debes seleccionar cómo llegó el producto.",
        status: "warning",
        duration: 3000,
        isClosable: true,
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
            inconsistencia: data.inconsistencia || false, // <-- Enviamos la decisión manual del operador
          }),
        }
      );

      const text = await res.text();

      if (!res.ok) throw new Error(text);

      toast({
        title: "Recepción registrada",
        description: data.inconsistencia 
          ? "Marcado con inconsistencia. Derivado a Evaluación Técnica."
          : "Recepción limpia. Producto ingresado.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      cargarSolicitudes();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al registrar",
        description: "Revisa la consola para más información.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#0f0f0f">
        <Spinner size="xl" color="orange.400" />
      </Box>
    );
  }

  // Filtros
  const pendientes = solicitudes.filter(
    (s) => s.estado === "Pendiente" || s.estado === "En garantia" || s.estado === "Aprobada"
  );
  
  const procesadas = solicitudes.filter(
    (s) => s.estado !== "Pendiente" && s.estado !== "En garantia" && s.estado !== "Aprobada"
  );

  return (
    <Box p={8} bg="#0f0f0f" minH="100vh" color="white">
      <HStack justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading color="#e0e0e0" size="lg">Panel de Logística</Heading>
          <Text fontSize="sm" color="gray.400">
            Rol: {usuario?.rol || "Operador"} • Usuario: {usuario?.nombre || "Funcionario"}
          </Text>
        </VStack>

        <HStack>
          <Button onClick={() => navigate(-1)} colorScheme="gray" variant="outline" size="sm">Volver</Button>
          <Button onClick={handleLogout} colorScheme="red" variant="outline" size="sm">Cerrar Sesión</Button>
        </HStack>
      </HStack>

      <Tabs variant="enclosed" colorScheme="orange">
        <TabList borderColor="#333">
          <Tab _selected={{ color: "white", bg: "#1a1a1a", borderColor: "#333", borderBottomColor: "#1a1a1a" }} color="gray.400">
            Pendientes de Recepción ({pendientes.length})
          </Tab>
          <Tab _selected={{ color: "white", bg: "#1a1a1a", borderColor: "#333", borderBottomColor: "#1a1a1a" }} color="gray.400">
            Historial Procesado ({procesadas.length})
          </Tab>
        </TabList>

        <TabPanels bg="#1a1a1a" border="1px solid #333" borderTop="none" borderBottomRadius="lg" p={4}>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {pendientes.length === 0 ? (
                <Text color="gray.400" textAlign="center" py={6}>No tienes paquetes pendientes de recepción.</Text>
              ) : (
                pendientes.map((s) => (
                  <Card key={s.id_solicitud} bg="#222" border="1px solid #333" borderRadius="md">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold" color="orange.300" fontSize="lg">
                            Solicitud #{s.id_solicitud}
                          </Text>
                          <Badge colorScheme="yellow">{s.estado}</Badge>
                        </HStack>

                        <Text fontSize="sm" color="gray.300">
                          <strong>Motivo declarado por el cliente:</strong> {s.motivo}
                        </Text>

                        <Divider borderColor="#444" />

                        <Select
                          placeholder="Selecciona el estado físico real..."
                          bg="#111"
                          borderColor="#444"
                          color="white"
                          focusBorderColor="orange.400"
                          sx={{ "> option": { background: "#1a1a1a", color: "white" } }}
                          onChange={(e) => handleChange(s.id_solicitud, "estado", e.target.value)}
                        >
                          <option value="nuevo">Nuevo (Sellado)</option>
                          <option value="usado">Usado / Manipulado</option>
                          <option value="danado">Dañado (Golpes, trizaduras)</option>
                          <option value="defectuoso">Defectuoso (Falla eléctrica)</option>
                        </Select>

                        <Textarea
                          placeholder="Añade observaciones del análisis físico (Opcional)"
                          bg="#111"
                          borderColor="#444"
                          color="white"
                          focusBorderColor="orange.400"
                          resize="none"
                          onChange={(e) => handleChange(s.id_solicitud, "observacion", e.target.value)}
                        />

                        {/* NUEVO: Checkbox manual para el operador */}
                        <Box bg="#111" p={3} borderRadius="md" border="1px solid #444">
                          <Checkbox 
                            colorScheme="orange"
                            onChange={(e) => handleChange(s.id_solicitud, "inconsistencia", e.target.checked)}
                          >
                            <Text fontSize="sm" fontWeight="bold" color="orange.200">
                              Marcar inconsistencia con lo declarado (Derivar a Área Técnica)
                            </Text>
                          </Checkbox>
                        </Box>

                        <Button colorScheme="orange" onClick={() => registrarEstado(s.id_solicitud)}>
                          Registrar Recepción y Evaluar
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            {/* ... (Mismo código del historial resuelto) ... */}
            <VStack spacing={4} align="stretch">
              {procesadas.length === 0 ? (
                <Text color="gray.400" textAlign="center" py={6}>Aún no has procesado ninguna solicitud.</Text>
              ) : (
                procesadas.map((s) => (
                  <Card key={s.id_solicitud} bg="#111" border="1px solid #333" borderRadius="md" opacity={0.8}>
                    <CardBody>
                      <VStack align="stretch" spacing={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold" color="gray.300">Solicitud #{s.id_solicitud}</Text>
                          <Badge colorScheme={s.estado === "En revision" ? "purple" : "green"}>{s.estado}</Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.400"><strong>Motivo original:</strong> {s.motivo}</Text>
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