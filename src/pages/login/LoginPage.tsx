import { Center, Box, VStack } from '@chakra-ui/react';
import { LoginForm } from '@/features/auth';

const LoginPage = () => {
    return (
        <Center minH="100vh" bg="#F9F9FB" p={4}>
            <VStack spacing={10} mb={32}>
                {/* Logo Section */}
                <Box mb={8}>
                    <img src="/src/assets/Subtract.svg" alt="SeolStudy Logo" width="80" />
                </Box>

                <Box
                    w="full"
                    minW="580px"
                    bg="white"
                    p={14}
                    borderRadius="12px"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="#E0E5EB"
                >
                    <LoginForm />
                </Box>
            </VStack>
        </Center>
    );
};

export default LoginPage;
