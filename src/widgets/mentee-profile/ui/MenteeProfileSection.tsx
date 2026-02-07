import { useState } from 'react';
import {
  Box, Flex, HStack, Text, Avatar, SimpleGrid,
  IconButton, Button, Heading
} from '@chakra-ui/react';
import { ModifyIcon } from '@/shared/ui/icons';
import { MenteeProfileData } from '../model/types';
import { StatBadge } from './StatBadge';
import { AchievementDonut } from './AchievementDonut';

interface Props {
  profile: MenteeProfileData;
  userRole: 'MENTEE' | 'MENTOR';
}

export const MenteeProfileSection = ({ profile, userRole }: Props) => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  return (
    <Box w="full">
      <Box
        bg="white"
        borderRadius={{base:"10",md:"22"}}
        border="1px solid #53A8FE"
        p={{ base: "30px 20px", md: "30px 55px" }}
        boxShadow="3px 4px 4px 0 rgba(57, 83, 177, 0.08)"
        position="relative"
        mb={{ base: 8, md: 10 }}
      >
        {userRole === 'MENTEE' && (
          <IconButton
            aria-label="Edit Profile"
            icon={<ModifyIcon />}
            variant="ghost"
            position="absolute"
            top={{ base: 1, md: 6 }}
            right={{ base: 2, md: 8 }}
            color="gray.400"
            size="sm"
          />
        )}

        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 6, md: 10 }}
        >
          <Flex
            direction={{ base: 'row' }}
            align="center"
            gap={{ base: "16px", md: "31px" }}
            display={{ base: 'inline-flex', md: 'inline-flex' }}
          >
            <Avatar
              sx={{
                w: { base: '86px', md: '144px' },
                h: { base: '86px', md: '144px' }
              }}
              name={profile.name}
              src={profile.profileImgUrl || undefined}
            />

            <Flex
              display={{ base: 'inline-flex', md: 'inline-flex' }}
              direction="column"
            >
              <HStack align="baseline" mb={{ base: 4, md: 6 }} spacing={3}>
                <Text fontSize={{ base: "2xl", md: "28px" }} fontWeight="extrabold" color="gray.800" whiteSpace="nowrap">
                  {profile.name}님
                </Text>
                <Text fontSize={{ base: "md", md: "18px" }} color="gray.500" fontWeight="medium" whiteSpace="nowrap"> 
                  {profile.school} {profile.grade}
                </Text>
              </HStack>

              <SimpleGrid columns={2} spacingX={{base:0, md:4}} spacingY={{base:3, md:4}} maxW="400px">
                <StatBadge label="과제 제출" value={profile.stats.todaySubmitted} />
                <StatBadge label="플래너 제출" value={profile.stats.totalPlanners} />
                <StatBadge label="남은 과제" value={profile.stats.todayRemaining} />
                <StatBadge label="피드백 질문" value={profile.stats.todayFeedbackComments} />
              </SimpleGrid>
            </Flex>
          </Flex>

          <Box display={{ base: 'none', lg: 'block' }}>
            <Flex
              display="inline-flex"
              justifyContent="center"
              alignItems="flex-start"
              gap="50px"
            >
              <AchievementDonut label="국어" value={profile.achievement.korean} colorScheme="blue" />
              <AchievementDonut label="영어" value={profile.achievement.english} colorScheme="green" />
              <AchievementDonut label="수학" value={profile.achievement.math} colorScheme="purple" />
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box display={{ base: 'block', lg: 'none' }}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading fontSize="18px" fontWeight="bold" color="gray.800">
            과목별 달성률
          </Heading>

          <Flex gap={2} p={1}>
            <Button
              onClick={() => setPeriod('week')}
              bg={period === 'week' ? '#53A8FE' : 'white'}
              color={period === 'week' ? 'white' : 'gray.500'}
              borderRadius="20"
              shadow={'sm'}
              px={5}
              _hover={{}}
            >
              주
            </Button>
            <Button
              onClick={() => setPeriod('month')}
              bg={period === 'month' ? '#53A8FE' : 'white'}
              color={period === 'month' ? 'white' : 'gray.500'}
              borderRadius="20"
              shadow={'sm'}
              px={5}
              _hover={{}}
            >
              월
            </Button>
          </Flex>
        </Flex>

        <Box bg="#fff" borderRadius="3xl" p={6}>
          <HStack justify="space-between" spacing={2}>
            <AchievementDonut label="국어" value={profile.achievement.korean} colorScheme="blue" />
            <AchievementDonut label="영어" value={profile.achievement.english} colorScheme="green" />
            <AchievementDonut label="수학" value={profile.achievement.math} colorScheme="purple" />
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};