import { useState } from 'react';
import { 
  Box, Flex, HStack, Text, Avatar, Divider, SimpleGrid, 
  Stack, IconButton, Button, ButtonGroup, Heading
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
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
        borderRadius="3xl"
        border="1px solid"
        borderColor="#53A8FE"
        p={{ base: "24px 20px", md: "30px 55px" }} 
        boxShadow="sm"
        position="relative"
        mb={{ base: 8, md: 10 }}
      >
        {userRole === 'MENTEE' && (
          <IconButton
            aria-label="Edit Profile"
            icon={<EditIcon />}
            variant="ghost"
            position="absolute"
            top={{ base: 4, md: 6 }}
            right={{ base: 4, md: 8 }}
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
            direction={{ base: 'row'}}
            align="center"
            gap={{ base: 4, md: 10 }}
            flex={1}
            w="full"
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
              direction="column"
              flex={1}
              w="full"
              align={{ base: 'flex-start'}}
            >
              <HStack align="baseline" mb={{ base: 4, md: 6 }} spacing={3}>
                <Text fontSize={{ base: "18px", md: "2xl" }} fontWeight="extrabold" color="gray.800">
                  {profile.name}님
                </Text>
                <Text fontSize={{ base: "12px", md: "md" }} color="gray.500" fontWeight="medium">
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
            display={{ base: 'none', md: 'block' }}
            borderColor="gray.200"
          />

          <Box display={{ base: 'none', lg: 'block' }}>
            <Stack direction="row" spacing={16} align="center">
              <AchievementDonut label="국어" value={profile.achievement.korean} colorScheme="blue" />
              <AchievementDonut label="영어" value={profile.achievement.english} colorScheme="green" />
              <AchievementDonut label="수학" value={profile.achievement.math} colorScheme="purple" />
            </Stack>
          </Box>
        </Flex>
      </Box>

      <Box display={{ base: 'block', lg: 'none' }}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading fontSize="18px" fontWeight="bold" color="gray.800">
            과목별 달성률
          </Heading>
          
          <ButtonGroup isAttached size="sm" variant="outline" bg="gray.100" borderRadius="xl" p={1}>
            <Button 
              onClick={() => setPeriod('week')}
              bg={period === 'week' ? '#53A8FE' : 'transparent'}
              color={period === 'week' ? 'white' : 'gray.500'}
              border="none"
              borderRadius="lg"
              _hover={{}}
            >
              주
            </Button>
            <Button 
              onClick={() => setPeriod('month')}
              bg={period === 'month' ? '#53A8FE' : 'transparent'}
              color={period === 'month' ? 'white' : 'gray.500'}
              border="none"
              borderRadius="lg"
              _hover={{}}
            >
              월
            </Button>
          </ButtonGroup>
        </Flex>

        <Box bg="#F9FBFF" borderRadius="3xl" p={6}>
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