import { Flex, Text, HStack, Box, Wrap, WrapItem } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

interface CalendarLegendProps {
  showCompletedOnly: boolean;
  onToggleCompleted: (checked: boolean) => void;
  // isMobile prop 제거됨
}

// 🎨 반응형 과목 태그 컴포넌트
const ResponsiveSubjectTag = ({ 
  label, 
  shortLabel, 
  color 
}: { 
  label: string; 
  shortLabel: string; 
  color: string; 
}) => {
  return (
    <>
      <HStack 
        spacing={1.5} 
        align="center" 
        display={{ base: 'flex', md: 'none' }} 
      >
        <Text fontSize="13px" fontWeight="medium" color="gray.600">
          {shortLabel}
        </Text>
        <Box w="10px" h="10px" borderRadius="full" bg={color} />
      </HStack>

      <Flex 
        bg={color} 
        color="white" 
        px="15px" 
        py="6px" 
        borderRadius="full" 
        fontSize="14px" 
        fontWeight="600" 
        align="center"
        display={{ base: 'none', md: 'flex' }}
      >
        {label}
      </Flex>
    </>
  );
};

export const CalendarLegend = ({ 
  showCompletedOnly, 
  onToggleCompleted,
}: CalendarLegendProps) => {
  return (
    <Flex 
      w="full"
      justify={{ base: 'flex-start', md: 'space-between' }}
      align={{ base: 'flex-start', md: 'center' }}
      gap={{ base: 2, md: 4 }}
      mt={{ base: 4, md: 0 }}
      direction={{ base: 'column', md: 'row' }}
      flexWrap="wrap"
    >
      <Wrap justify="flex-start" spacing={{ base: 3, md: 2 }} w="full">
        <WrapItem>
          <ResponsiveSubjectTag label="국어" shortLabel="국" color="#53A8FE" />
        </WrapItem>
        <WrapItem>
          <ResponsiveSubjectTag label="영어" shortLabel="영" color="#35CE9D" />
        </WrapItem>
        <WrapItem>
          <ResponsiveSubjectTag label="수학" shortLabel="수" color="#A16AFF" />
        </WrapItem>
      </Wrap>

      {/* 필터 버튼 */}
      <Flex
        align="center"
        cursor="pointer"
        onClick={() => onToggleCompleted(!showCompletedOnly)}
        bg="transparent"
        _hover={{ opacity: 0.8 }}
        alignSelf={{ base: 'flex-end', md: 'center' }}
      >
        <CheckCircleIcon
          color={showCompletedOnly ? "#53A8FE" : "gray.300"}
          mr={1.5}
          w={6}
          h={6}
        />
        <Text 
          fontSize="sm" 
          color={showCompletedOnly ? "#53A8FE" : "gray.300"} 
          whiteSpace="nowrap" 
          fontWeight={showCompletedOnly ? "bold" : "normal"}
        >
          과제 완료
        </Text>
      </Flex>
    </Flex>
  );
};
