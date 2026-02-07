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
            p={4}
            borderRadius="12px"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: '#F0F2F5' }}
            onClick={onClick}
        >
            <Flex align="center" gap={8} flex={1}>
                <Text
                    fontSize="14px"
                    color="#A0A5B1"
                    fontWeight="500"
                    minW="60px"
                >
                    {menteeName}
                </Text>
                <Text
                    fontSize="16px"
                    color="#373E56"
                    fontWeight="600"
                >
                    {title}
                </Text>
            </Flex>
            <Text
                fontSize="14px"
                color="#A0A5B1"
                fontWeight="400"
            >
                {date}
            </Text>
        </Flex>
    );
};
