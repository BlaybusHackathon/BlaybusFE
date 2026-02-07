import { Box, Text, Textarea } from '@chakra-ui/react';

interface Props {
    title: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minH?: string;
    readOnly?: boolean; // [추가] 읽기 전용 모드
}

export const ReportSection = ({ title, value, onChange, placeholder, minH = "150px", readOnly = false }: Props) => {
    return (
        <Box mb={8}>
            <Text fontSize="18px" fontWeight="700" color="#373E56" mb={4}>
                {title}
            </Text>
            <Textarea
                value={value}
                onChange={(e) => !readOnly && onChange(e.target.value)} // readOnly일 때 변경 차단
                placeholder={readOnly ? "" : placeholder} // readOnly일 때 placeholder 숨김
                isReadOnly={readOnly} // Chakra UI readOnly 스타일 적용
                minH={minH}
                bg={readOnly ? "white" : "#F9F9FB"} // 읽기 전용일 때 흰색 배경
                border={readOnly ? "1px solid" : "none"}
                borderColor={readOnly ? "#E2E4E8" : "transparent"}
                borderRadius="22"
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
                cursor={readOnly ? "default" : "text"}
            />
        </Box>
    );
};