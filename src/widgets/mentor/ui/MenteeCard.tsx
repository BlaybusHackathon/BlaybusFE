import { Box, Flex, Text, Avatar, VStack, Progress } from '@chakra-ui/react';
import { MenteeSummary } from '../../../pages/mentor/mypage/model/types';
import { useNavigate } from 'react-router-dom';

interface Props {
  mentee: MenteeSummary;
}

export const MenteeCard = ({ mentee }: Props) => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      minW="380px"
      h="185px"
      p="30px 21px"
      borderRadius="20px"
      border="1px solid #53A8FE"
      boxShadow="3px 4px 4px 0 rgba(57, 83, 177, 0.08)"
      bg="#ffffffff"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: '3px 4px 4px 0 rgba(57, 83, 177, 0.16)' }
      }
      onClick={() => navigate(`/mentor/mentee/${mentee.id}`)}
    >
      <Flex display="flex" alignItems="center" gap="14px">
        <Avatar
          w="97px"
          h="97px"
          name={mentee.name}
          src={mentee.profileImgUrl || undefined}
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
    </Box >
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