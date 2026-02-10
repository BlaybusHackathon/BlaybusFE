import { Center, Box, VStack } from '@chakra-ui/react';
import { LoginForm } from '@/features/auth';
import { LogoIcon } from '@/shared/ui/icons';

const LoginPage = () => {
    return (
        <Center minH="100vh" bg="#F9F9FB" p={4} w="full" overflowX="hidden">
            <VStack spacing={10} mb={32} w="full" maxW="580px">
                <Box mb={8}>
                    <LogoIcon size={90}/>
                </Box>

                <Box
                    w="full" 
                    bg={{ base: "none", md: "white" }}
                    p={{ base: 0, md: 14 }}
                    borderRadius={"12px"}
                    boxShadow={{ base: "none", md: "sm" }}
                    border={{ base: "none", md: "1px solid #E0E5EB" }}
                >
                    <LoginForm />
                </Box>
            </VStack>
        </Center>
    );
};

export default LoginPage;
