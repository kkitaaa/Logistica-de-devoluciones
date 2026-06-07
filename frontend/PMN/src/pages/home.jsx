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

export default function Home() {
  const navigate = useNavigate();

  const bg = useColorModeValue("#0f0f0f", "#0f0f0f");
  const cardBg = useColorModeValue("#1a1a1a", "#1a1a1a");
  const border = "1px solid #2a2a2a";

  return (
    <Box
      minH="100vh"
      p={10}
      textAlign="center"
      bg={bg}
      color="white"
    >
      <Heading mb={2}>
        Sistema de Logística de Devoluciones
      </Heading>

      <HStack spacing={8} justify="center" flexWrap="wrap">

        {/* CARD 1 */}
        <Card
          w="300px"
          bg={cardBg}
          border={border}
          _hover={{ transform: "scale(1.05)", boxShadow: "0 0 15px rgba(0,0,0,0.6)" }}
          transition="0.2s"
        >
          <CardBody>
            <VStack spacing={4}>
              <Heading size="md">Crear devolución</Heading>

              <Text fontSize="sm" color="gray.400">
                Ingresar nueva solicitud de devolución de productos
              </Text>

              <Button
                colorScheme="blue"
                w="100%"
                onClick={() => navigate("/devolucion")}
              >
                Ir
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* CARD 2 */}
        <Card
          w="300px"
          bg={cardBg}
          border={border}
          _hover={{ transform: "scale(1.05)", boxShadow: "0 0 15px rgba(0,0,0,0.6)" }}
          transition="0.2s"
        >
          <CardBody>
            <VStack spacing={4}>
              <Heading size="md">Ver solicitudes</Heading>

              <Text fontSize="sm" color="gray.400">
                Revisión de solicitudes ingresadas y su estado
              </Text>

              <Button
                colorScheme="green"
                w="100%"
                onClick={() => navigate("/solicitudes")}
              >
                Ir
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* CARD 3 */}
        <Card
          w="300px"
          bg={cardBg}
          border={border}
          _hover={{ transform: "scale(1.05)", boxShadow: "0 0 15px rgba(0,0,0,0.6)" }}
          transition="0.2s"
        >
          <CardBody>
            <VStack spacing={4}>
              <Heading size="md">Mis solicitudes</Heading>

              <Text fontSize="sm" color="gray.400">
                Ver solo las solicitudes del cliente autenticado
              </Text>

              <Button
                colorScheme="teal"
                w="100%"
                onClick={() => navigate("/mis-solicitudes")}
              >
                Ir
              </Button>
            </VStack>
          </CardBody>
        </Card>

      </HStack>
    </Box>
  );
}