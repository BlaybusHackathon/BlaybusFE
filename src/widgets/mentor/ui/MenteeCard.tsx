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
      justifyContent="center"
      minW="337px"
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

        <VStack
          display="flex"
          w="183px"
          align="flex-start"
          spacing="33px"
          justify="center"
        >
          <Text color="#373E56"
            fontSize="18px"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="normal"
          >
            {mentee.name}님
          </Text>

          <VStack display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap="8px"
            alignSelf="stretch"
          >
            <AchievementRow label="국" value={mentee.achievement.korean} colorScheme="#53A8FE" />
            <AchievementRow label="영" value={mentee.achievement.english} colorScheme="#35CE9D" />
            <AchievementRow label="수" value={mentee.achievement.math} colorScheme="#A16AFF" />
          </VStack>
        </VStack>
      </Flex>
    </Box >
  );
};

const AchievementRow = ({ label, value, colorScheme }: { label: string; value: number; colorScheme: string }) => (
  <Flex display="flex"
    alignItems="center"
    gap="9px"
    alignSelf="stretch"
  >
    <Text color="#394250"
      fontSize="13px"
      fontStyle="normal"
      fontWeight="400"
      lineHeight="normal"
    >
      {label}
    </Text>
    <Box>
      <Progress
        value={value}
        w="162px"
        h="8px"
        borderRadius="5px"
        border="1px solid #BADDFF"
        bg="white"
        sx={{
          '& > div': {
            transition: 'width 0.5s ease-in-out',
            backgroundColor: colorScheme,
          }
        }}
      />
    </Box>
  </Flex>
);