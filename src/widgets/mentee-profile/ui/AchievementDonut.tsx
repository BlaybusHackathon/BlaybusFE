import { Box, Flex, CircularProgress, CircularProgressLabel, chakra } from '@chakra-ui/react';

interface Props {
  label: string;
  value: number;
  colorScheme: string;
}

const COLOR_MAP: Record<string, string> = {
  blue: '#53A8FE',
  green: '#35CE9D',
  purple: '#A16AFF',
};

export const AchievementDonut = ({ label, value, colorScheme }: Props) => {
  const colorCode = COLOR_MAP[colorScheme] || '#EEEEEE';

  return (
    <Box position="relative"
      display="inline-flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
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
        trackColor="#EEEEEE"
        value={value}
        size={{ base: "122px", md: "122px" }}
        textAlign="center"
        color={colorCode}
        thickness={14}
        capIsRound
      >
        <CircularProgressLabel
          fontSize={{ base: "34px", md: "34px" }}
          fontWeight="600"
          color={colorCode}
        >
          {value}
          <chakra.span fontSize={{ base: "18px", md: "18px" }} ml={0.5}>
            %
          </chakra.span>
        </CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
};