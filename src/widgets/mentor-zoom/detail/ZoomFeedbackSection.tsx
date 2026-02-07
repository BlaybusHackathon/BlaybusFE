import { Box, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
    title: string;
    children: ReactNode;
    mb?: string | number;
}

export const ZoomFeedbackSection = ({ title, children, mb = 10 }: Props) => {
    return (
        <Box mb={mb}>
            <Text fontSize="18px" fontWeight="700" color="#373E56" mb={4}>
                {title}
            </Text>
            {children}
        </Box>
    );
};
