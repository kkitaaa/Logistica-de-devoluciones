import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  HStack,
  Container,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Devolucion() {
  const [idPedido, setIdPedido] = useState("");
  const [motivo, setMotivo] = useState("");
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  const { usuario, obtenerHeaders, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Ajuste de seguridad por si la ID viene distinto en tu contexto
      const clienteId = usuario?.id_cliente || usuario?.id;
      if (!clienteId) {
        navigate("/login");
        return;
      }

      const res = await fetch(apiUrl("/api/solicitud"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...obtenerHeaders(), // Integramos los headers de auth
        },
        body: JSON.stringify({
          id_pedido: idPedido,
          motivo,
          id_cliente: clienteId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Solicitud enviada",
          description: data.mensaje || "Tu solicitud de devolución fue registrada.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        // Redirección automática igual a tu lógica original
        setTimeout(() => {
          navigate("/mis-solicitudes");
        }, 2000);
      } else {
        throw new Error(data.error || "Error al procesar la solicitud");
      }
    } catch (err) {
      toast({
        title: "Error de conexión",
        description: err.message || "No se pudo conectar con el servidor.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box p={6} minH="100vh" bg="#0f0f0f" color="white">
      <HStack justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading color="#e0e0e0" size="lg">
            Devoluciones
          </Heading>
          <Text fontSize="sm" color="gray.400">
            Rol: {usuario?.rol} • Usuario: {usuario?.nombre || "Cliente"}
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
            onClick={handleLogout}
            colorScheme="red"
            variant="outline"
            size="sm"
          >
            Cerrar Sesión
          </Button>
        </HStack>
      </HStack>

      <Container maxW="container.sm" py={10}>
        <Box
          p={8}
          border="1px solid #2a2a2a"
          borderRadius="lg"
          bg="#1a1a1a"
          boxShadow="xl"
        >
          <Heading size="md" mb={6} textAlign="center" color="#e0e0e0">
            Solicitar Devolución
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel color="gray.300">ID del Pedido</FormLabel>
                <Input
                  type="text"
                  placeholder="Ej: 15"
                  value={idPedido}
                  onChange={(e) => setIdPedido(e.target.value)}
                  focusBorderColor="blue.500"
                  bg="#222222"
                  borderColor="#2a2a2a"
                  color="white"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.300">Motivo de la devolución</FormLabel>
                <Textarea
                  placeholder="Describe por qué quieres devolver este pedido..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={4}
                  focusBorderColor="blue.500"
                  bg="#222222"
                  borderColor="#2a2a2a"
                  color="white"
                  resize="none"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                mt={4}
                isLoading={cargando}
                loadingText="Enviando..."
                _hover={{ bg: "blue.400" }}
              >
                Enviar Solicitud
              </Button>
            </VStack>
          </form>

          {/* Botón opcional por si el usuario no quiere esperar el setTimeout */}
          <Button
            variant="ghost"
            colorScheme="gray"
            width="full"
            mt={4}
            color="gray.400"
            _hover={{ color: "white", bg: "#2a2a2a" }}
            onClick={() => navigate("/mis-solicitudes")}
          >
            Ver mis solicitudes
          </Button>
        </Box>
      </Container>
    </Box>
  );
}