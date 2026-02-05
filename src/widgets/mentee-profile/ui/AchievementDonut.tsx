import { Box, Flex, CircularProgress, CircularProgressLabel, useBreakpointValue, chakra } from '@chakra-ui/react';

interface Props {
  label: string;
  value: number;
  colorScheme: string; 
}

const COLOR_MAP: Record<string, string> = {
  blue: '#3182CE', 
  green: '#38A169', 
  purple: '#805AD5',
};

export const AchievementDonut = ({ label, value, colorScheme }: Props) => {
  const colorCode = COLOR_MAP[colorScheme] || '#718096';

  const thicknessValue = useBreakpointValue({ base: 12, md: 18 });

  return (
    <Box position="relative" display="flex" flexDirection="column" alignItems="center" px={4}>
      <Flex
        bg={colorCode}
        color="white"
        w={{ base: "50px", md: "66px" }}
        h={{ base: "30px", md: "38px" }}
        align="center"
        justify="center"
        borderRadius="md"
        mb={3} 
        position="relative"
        fontSize={{ base: "12px", md: "sm" }}
        fontWeight="bold"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '6px 6px 0',
          borderStyle: 'solid',
          borderColor: `${colorCode} transparent transparent transparent`,
        }}
      >
        {label}
      </Flex>

      <CircularProgress
        value={value}
        size={{ base: "80px", md: "122px" }} 
        thickness={thicknessValue}
        color={colorScheme + '.500'}
        trackColor="gray.100"
        capIsRound
      >
        <CircularProgressLabel 
          fontSize={{ base: "22px", md: "4xl" }} 
          fontWeight="bold" 
          color={colorCode}
          pb={1}
        >
          {value}
          <chakra.span fontSize={{ base: "10px", md: "18px" }} ml={0.5}>
            %
          </chakra.span>
        </CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
};