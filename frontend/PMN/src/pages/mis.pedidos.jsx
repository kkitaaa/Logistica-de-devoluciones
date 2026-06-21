import { useEffect, useState } from "react";
import {
  Box,
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
  Text,
  HStack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../services/api";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  
  const { usuario, obtenerHeaders, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const clienteId = usuario?.id_cliente || usuario?.id;
        
        if (!clienteId) {
          throw new Error("No se pudo identificar al cliente");
        }

        // Llamamos a la ruta que me pasaste en el router
        const res = await fetch(apiUrl(`/api/mis-pedidos/${clienteId}`), {
          headers: obtenerHeaders(),
        });

        if (!res.ok) throw new Error("Error al obtener los pedidos");

        const data = await res.json();
        setPedidos(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error al cargar",
          description: "Hubo un problema al intentar obtener tu historial de pedidos.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, [usuario, obtenerHeaders, toast]);

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
        <Text mt={3} color="gray.300">Cargando tus pedidos...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} minH="100vh" bg="#0f0f0f" color="white">
      {/* Header estandarizado */}
      <HStack justify="space-between" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading color="#e0e0e0" size="lg">
            Mis Pedidos
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

      {/* Contenedor de la tabla */}
      <TableContainer
        border="1px solid #2a2a2a"
        borderRadius="lg"
        overflow="hidden"
        bg="#1a1a1a"
        boxShadow="lg"
      >
        <Table variant="simple" size="md">
          <Thead bg="#141414">
            <Tr>
              <Th color="gray.300">ID Pedido</Th>
              <Th color="gray.300">Fecha de Compra</Th>
              <Th color="gray.300" isNumeric>Monto Total</Th>
              <Th color="gray.300" textAlign="center">Acción</Th>
            </Tr>
          </Thead>

          <Tbody>
            {pedidos.length === 0 ? (
              <Tr>
                <Td colSpan={4} textAlign="center" py={8} color="gray.400">
                  Aún no tienes pedidos registrados.
                </Td>
              </Tr>
            ) : (
              pedidos.map((p) => (
                <Tr
                  key={p.id_pedido}
                  _hover={{ bg: "#222222" }}
                  transition="0.2s"
                >
                  <Td fontWeight="bold" color="blue.300">
                    #{p.id_pedido}
                  </Td>

                  <Td color="gray.300">
                    {new Date(p.fecha).toLocaleDateString()}
                  </Td>

                  <Td isNumeric fontWeight="semibold" color="green.300">
                    ${p.monto_total?.toLocaleString()}
                  </Td>

                  <Td textAlign="center">
                    <Button 
                      size="sm" 
                      colorScheme="orange" 
                      variant="outline"
                      _hover={{ bg: "orange.500", color: "white" }}
                      onClick={() => navigate('/devolucion')} // Te lleva a la vista de devoluciones
                    >
                      Devolver
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}