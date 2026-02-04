import { Box, Flex, HStack, Text, Avatar, Divider, SimpleGrid, Stack } from '@chakra-ui/react';
import { MenteeProfileData } from '../model/types';
import { StatBadge } from './StatBadge';
import { AchievementDonut } from './AchievementDonut';

interface Props {
  profile: MenteeProfileData;
}

export const MenteeProfileSection = ({ profile }: Props) => {
  return (
    <Box
      bg="white"
      borderRadius="3xl"
      border="1px solid"
      borderColor="#53A8FE"
      p={"30px 55px"}
      boxShadow="sm"
    >
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        align="center"
        justify="space-between"
        gap={{ base: 10, lg: 10 }}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          gap={10}
          flex={1}
          w="full"
        >
          <Avatar
            sx={{ w: '144px', h: '144px' }}
            name={profile.name}
            src={profile.profileImgUrl || undefined}
          />

          <Flex
            direction="column"
            flex={1}
            w="full"
            align={{ base: 'center', md: 'flex-start' }}
          >
            <HStack align="baseline" mb={6} spacing={3}>
              <Text fontSize="2xl" fontWeight="extrabold" color="gray.800">
                {profile.name}님
              </Text>
              <Text fontSize="md" color="gray.500" fontWeight="medium">
                {profile.school} {profile.grade}
              </Text>
            </HStack>

            <SimpleGrid columns={2} spacingX={4} spacingY={4} maxW="400px">
              <StatBadge label="과제 제출" value={profile.stats.todaySubmitted} />
              <StatBadge label="플래너" value={profile.stats.totalPlanners} />

              <StatBadge label="남은 과제" value={profile.stats.todayRemaining} />
              <StatBadge label="피드백 질문" value={profile.stats.todayFeedbackComments} />
            </SimpleGrid>
          </Flex>
        </Flex>

        <Divider
          orientation="vertical"
          h="120px"
          display={{ base: 'none', lg: 'block' }}
          borderColor="gray.200"
        />

        <Flex justify="center" w={{ base: 'full', lg: 'auto' }}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: 8, md: 16 }}
            align="center"
          >
            <AchievementDonut label="국어" value={profile.achievement.korean} colorScheme="blue" />
            <AchievementDonut label="영어" value={profile.achievement.english} colorScheme="green" />
            <AchievementDonut label="수학" value={profile.achievement.math} colorScheme="purple" />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};