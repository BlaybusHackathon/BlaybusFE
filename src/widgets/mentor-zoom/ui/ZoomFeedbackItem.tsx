import { Flex, Text, Icon } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface Props {
  countNumber: number;
  summary: string;
  meetingDate: string;
  onClick: () => void;
}

export const ZoomFeedbackItem = ({
  countNumber,
  summary,
  meetingDate,
  onClick,
}: Props) => {
  const formatDate = (dateString: string) => dateString.split(' ')[0];

  return (
    <Flex
      align="center"
      justify="space-between"
      p={5}
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.100"
      cursor="pointer"
      transition="all 0.2s"
      role="group"
      onClick={onClick}
      _hover={{ 
        bg: 'blue.50', 
        borderColor: 'blue.100',
        transform: 'translateY(-2px)',
        boxShadow: 'sm'
      }}
    >
      <Flex align="center" gap={4} overflow="hidden">
        <Flex 
          w="36px" h="36px" 
          borderRadius="lg" 
          bg="gray.100" 
          justify="center" 
          align="center"
          color="gray.600"
          fontWeight="bold"
          fontSize="sm"
          flexShrink={0}
          transition="all 0.2s"
          _groupHover={{ bg: 'white', color: 'blue.500' }}
        >
          #{countNumber}
        </Flex>

        <Text 
          fontSize="md" 
          fontWeight="bold" 
          color="gray.700" 
          noOfLines={1}
        >
          {summary}
        </Text>
      </Flex>

      <Flex align="center" gap={4} flexShrink={0}>
        <Text fontSize="sm" color="gray.500">
          {formatDate(meetingDate)}
        </Text>
        
        <Icon 
          as={ChevronRightIcon} 
          color="blue.400"
          opacity={0}
          transform="translateX(-10px)"
          transition="all 0.2s"
          _groupHover={{ opacity: 1, transform: 'translateX(0)' }}
        />
      </Flex>
    </Flex>
  );
};