import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const rol = usuario?.rol;

  const bg = useColorModeValue("#0f0f0f", "#0f0f0f");
  const cardBg = useColorModeValue("#1a1a1a", "#1a1a1a");
  const border = "1px solid #2a2a2a";

  if (!usuario) {
    return null;
  }

  return (
    <Box minH="100vh" p={10} textAlign="center" bg={bg} color="white">

      {/* HEADER */}
      <HStack justify="space-between" mb={10}>
        <VStack align="start" spacing={0}>
          <Text fontSize="m" color="white">
            Bienvenido
          </Text>
          <Text fontSize="sm" color="gray.400">
            Rol: {usuario?.rol} • Usuario: {usuario?.nombre || "Cliente"}
          </Text>
        </VStack>

        <Button
          onClick={handleLogout}
          colorScheme="red"
          variant="outline"
          size="sm"
        >
          Cerrar Sesión
        </Button>
      </HStack>

      <Heading color="#e0e0e0" mb={8}>
        Sistema de Logística de Devoluciones
      </Heading>

      <HStack spacing={8} justify="center" flexWrap="wrap">

        {/* ================= CLIENTE ================= */}
        {rol === "cliente" && (
          <>
            <Card w="300px" bg={cardBg} border={border} transition="0.2s" _hover={{ transform: "scale(1.05)" }}>
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md">Pedir</Heading>
                  <Text fontSize="sm" color="gray.400">
                    Crear un nuevo pedido
                  </Text>
                  <Button colorScheme="purple" w="100%" onClick={() => navigate("/crear-pedido")}>
                    Ir
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card w="300px" bg={cardBg} border={border} transition="0.2s" _hover={{ transform: "scale(1.05)" }}>
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md">Mis pedidos</Heading>
                  <Text fontSize="sm" color="gray.400">
                    Ver el estado de mis pedidos
                  </Text>
                  <Button colorScheme="green" w="100%" onClick={() => navigate("/mis-pedidos")}>
                    Ir
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card w="300px" bg={cardBg} border={border} transition="0.2s" _hover={{ transform: "scale(1.05)" }}>
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md">Crear devolución</Heading>
                  <Text fontSize="sm" color="gray.400">
                    Solicitar devolución de productos
                  </Text>
                  <Button colorScheme="blue" w="100%" onClick={() => navigate("/devolucion")}>
                    Ir
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card w="300px" bg={cardBg} border={border} transition="0.2s" _hover={{ transform: "scale(1.05)" }}>
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md">Mis solicitudes</Heading>
                  <Text fontSize="sm" color="gray.400">
                    Ver estado de mis devoluciones
                  </Text>
                  <Button colorScheme="teal" w="100%" onClick={() => navigate("/mis-solicitudes")}>
                    Ir
                  </Button>
                </VStack>
              </CardBody>
            </Card>

          </>
        )}

        {/* ================= OPERADOR LOGÍSTICO ================= */}
        {rol === "operador_logistica" && (
          <>
          <Card w="300px" bg={cardBg} border={border} transition="0.2s" _hover={{ transform: "scale(1.05)" }}>
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Solicitudes</Heading>
                <Text fontSize="sm" color="gray.400">
                  Revisar y procesar devoluciones físicas
                </Text>
                <Button colorScheme="orange" w="100%" onClick={() => navigate("/operador/solicitudes")}>
                  Ir
                </Button>
              </VStack>
            </CardBody>
          </Card>

           <Card w="300px" bg={cardBg} border={border} transition="0.2s" _hover={{ transform: "scale(1.05)" }}>
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Todas las solicitudes</Heading>
                <Text fontSize="sm" color="gray.400">
                  Revisar todas las solicitudes realizadas
                </Text>
                <Button colorScheme="purple" w="100%" onClick={() => navigate("/solicitudes")}>
                  Ir
                </Button>
              </VStack>
            </CardBody>
          </Card>         
          </>
        )}

        {/* ================= TÉCNICO ================= */}
        {rol === "evaluador_tecnico" && (
          <>
          <Card w="300px" bg={cardBg} border={border} transition="0.2s" _hover={{ transform: "scale(1.05)" }}>
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Evaluación técnica</Heading>
                <Text fontSize="sm" color="gray.400">
                  Analizar estado de productos mandados a revisión
                </Text>
                <Button colorScheme="purple" w="100%" onClick={() => navigate("/evaluacion-tecnica")}>
                  Ir
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card w="300px" bg={cardBg} border={border} transition="0.2s" _hover={{ transform: "scale(1.05)" }}>
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Todas las solicitudes</Heading>
                <Text fontSize="sm" color="gray.400">
                  Revisar todas las solicitudes realizadas
                </Text>
                <Button colorScheme="teal" w="100%" onClick={() => navigate("/solicitudes")}>
                  Ir
                </Button>
              </VStack>
            </CardBody>
          </Card>   
          </>
        )}

      </HStack>
    </Box>
  );
}