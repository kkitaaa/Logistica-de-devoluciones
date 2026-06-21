import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Input,
  VStack,
  Heading,
  useToast,
  Container,
  Spinner,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CrearPedido() {
  const [productosBD, setProductosBD] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { usuario, obtenerHeaders, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(apiUrl("/api/productos"), {
          headers: obtenerHeaders(), 
        });

        if (!res.ok) throw new Error("Error al conectar con el servidor");

        const data = await res.json();
        setProductosBD(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error de conexión",
          description: "No se pudo cargar el catálogo de productos.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [obtenerHeaders, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productoEncontrado = productosBD.find(
        (p) => p.id_producto === Number(productoSeleccionado)
      );
      
      const precioUnitario = productoEncontrado ? productoEncontrado.precio : 0;
      
      const montoTotalCalculado = precioUnitario * Number(cantidad);

      const arregloProductos = [Number(productoSeleccionado)];

      const payload = {
        id_cliente: usuario?.id_cliente || usuario?.id || 1, 
        productos: arregloProductos,
        cantidad: Number(cantidad),
        monto_total: montoTotalCalculado,
        fecha: new Date().toISOString(),
      };

      const res = await fetch(apiUrl("/api/pedido"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...obtenerHeaders(), 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Falló la creación del pedido");

      toast({
        title: "Pedido creado",
        description: `Tu pedido por $${montoTotalCalculado.toLocaleString()} fue registrado con éxito.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setProductoSeleccionado("");
      setCantidad(1);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Hubo un problema al registrar el pedido.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
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
        <Spinner size="xl" color="blue.500" />
        <Text mt={3}>Cargando catálogo...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} minH="100vh" bg="#0f0f0f" color="white">
      <HStack justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading color="#e0e0e0" size="lg">
            Realizar Pedido
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
            Selecciona tus componentes
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel color="gray.300">Componente Electrónico</FormLabel>
                <Select
                  placeholder="Elige un producto de la lista"
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                  focusBorderColor="blue.500"
                  bg="#222222"
                  borderColor="#2a2a2a"
                  color="white"
                  sx={{
                    "> option": {
                      background: "#1a1a1a",
                      color: "white",
                    },
                  }}
                >
                  {productosBD.map((prod) => (
                    <option key={prod.id_producto} value={prod.id_producto}>
                      {prod.nombre} - ${prod.precio?.toLocaleString()}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.300">Cantidad</FormLabel>
                <Input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  focusBorderColor="blue.500"
                  bg="#222222"
                  borderColor="#2a2a2a"
                  color="white"
                />
              </FormControl>

              {/* Pequeño detalle de UX: Mostrar el total en vivo antes de enviar */}
              {productoSeleccionado && cantidad > 0 && (
                <Text color="green.300" fontWeight="bold" w="full" textAlign="right">
                  Total estimado: $
                  {(
                    (productosBD.find(
                      (p) => p.id_producto === Number(productoSeleccionado)
                    )?.precio || 0) * Number(cantidad)
                  ).toLocaleString()}
                </Text>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                mt={4}
                isLoading={isSubmitting}
                loadingText="Procesando..."
                _hover={{ bg: "blue.400" }}
              >
                Confirmar Compra
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}