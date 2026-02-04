import { Box, Flex, Text, Avatar, VStack, Progress } from '@chakra-ui/react';
import { MenteeSummary } from '../model/types';
import { useNavigate } from 'react-router-dom';

interface Props {
  mentee: MenteeSummary;
}

export const MenteeCard = ({ mentee }: Props) => {
  const navigate = useNavigate();

  return (
    <Box
      minW="330px"
      h="150px" // 높이를 150px로 고정 (또는 minH="150px")
      bg="white"
      p={5}
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="sm"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
      onClick={() => navigate(`/mentor/mentee/${mentee.id}`)}
      display="flex"         
      alignItems="center"  
    >
      <Flex align="center" w="full">
        <Avatar
          size="xl"
          name={mentee.name}
          src={mentee.profileImgUrl || undefined}
          mr={6} 
        />

        <VStack align="stretch" spacing={3} flex={1} justify="center">
          <Text fontWeight="extrabold" fontSize="lg" lineHeight="1">
            {mentee.name}님
          </Text>

          <VStack spacing={2} align="stretch">
            <AchievementRow label="국" value={mentee.achievement.korean} colorScheme="blue" />
            <AchievementRow label="영" value={mentee.achievement.english} colorScheme="green" />
            <AchievementRow label="수" value={mentee.achievement.math} colorScheme="purple" />
          </VStack>
        </VStack>
      </Flex>
    </Box>
  );
};

const AchievementRow = ({ label, value, colorScheme }: { label: string; value: number; colorScheme: string }) => (
  <Flex align="center">
    <Text fontSize="sm" fontWeight="bold" color="gray.500" w="20px" mb="1px">
      {label}
    </Text>
    <Box flex={1} ml={3}>
      <Progress
        value={value}
        height="8px" 
        colorScheme={colorScheme}
        borderRadius="full"
        bg="gray.100"
        sx={{
            '& > div': {
                transition: 'width 0.5s ease-in-out',
            }
        }}
      />
    </Box>
  </Flex>
);