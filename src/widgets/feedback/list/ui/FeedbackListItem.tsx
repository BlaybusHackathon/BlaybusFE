import { Flex, Text } from '@chakra-ui/react';

interface Props {
    menteeName: string;
    title: string;
    date: string;
    onClick: () => void;
}

export const FeedbackListItem = ({ menteeName, title, date, onClick }: Props) => {
    return (
        <Flex
            align="center"
            justify="space-between"
            bg="#F9F9FB"
            p="28px 32px"
            borderRadius="22px"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: '#F0F2F5' }}
            onClick={onClick}
        >
            <Flex align="center" gap={10} flex={1}>
                <Text
                    fontSize="16px"
                    color="#A0A5B1"
                    fontWeight="500"
                    minW="60px"
                    textAlign="center"
                >
                    {menteeName}
                </Text>
                <Text
                    fontSize="16px"
                    color="#373E56"
                    fontWeight="600"
                    textAlign="center"
                >
                    {title}
                </Text>
            </Flex>
            <Text
                fontSize="16px"
                color="#A0A5B1"
                fontWeight="400"
                textAlign="center"
            >
                {date}
            </Text>
        </Flex>
    );
};
