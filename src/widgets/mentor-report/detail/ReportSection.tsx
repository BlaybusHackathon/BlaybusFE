import { Box, Text, Textarea } from '@chakra-ui/react';

interface Props {
    title: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minH?: string;
}

export const ReportSection = ({ title, value, onChange, placeholder, minH = "150px" }: Props) => {
    return (
        <Box mb={8}>
            <Text fontSize="18px" fontWeight="700" color="#373E56" mb={4}>
                {title}
            </Text>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                minH={minH}
                bg="#F9F9FB"
                border="none"
                borderRadius="12px"
                p={6}
                fontSize="16px"
                color="#7E7E7E"
                _placeholder={{ color: '#9B9BA4' }}
                _focus={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: '#53A8FE',
                    boxShadow: 'none'
                }}
                resize="none"
                lineHeight="1.6"
            />
        </Box>
    );
};
