import { Center, Box, VStack } from '@chakra-ui/react';
import { LoginForm } from '@/features/auth';
import { LogoIcon } from '@/shared/ui/icons';

const LoginPage = () => {
    return (
        <Center minH="100vh" bg="#F9F9FB" p={4}>
            <VStack spacing={10} mb={32}>
                <Box mb={8}>
                    <LogoIcon />
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
