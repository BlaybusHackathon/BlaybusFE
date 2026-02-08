import { Box, Text, Grid, GridItem, Divider, Flex, Spinner } from '@chakra-ui/react';
import { MenteeProfileSection } from '../../../widgets/mentee-profile/ui/MenteeProfileSection';
import { MentorPlannerSection } from '@/widgets/mentor-planner';
import { MenteeWeaknessSection } from '@/widgets/mentor-weakness/ui/MenteeWeaknessSection';
import { WeeklyReportList } from '@/widgets/mentor-report/ui/WeeklyReportList';
import { ZoomFeedbackList } from '@/widgets/mentor-zoom/ui/ZoomFeedbackList';
import { useParams } from 'react-router-dom';
import { useMenteeDashboard } from '@/features/mentee-dashboard/model/useMenteeDashboard';

const MentorMenteeManagePage = () => {
    const { menteeId } = useParams();
    const { data: profile, isLoading, error } = useMenteeDashboard(menteeId);

    return (
        <Box maxW="1200px" mx="auto" p={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>담당 멘티</Text>

            {isLoading && (
                <Flex align="center" gap={2} color="gray.400" py={6}>
                    <Spinner size="sm" />
                    프로필을 불러오는 중입니다.
                </Flex>
            )}

            {error && (
                <Text color="red.400" py={6}>
                    멘티 프로필을 불러오지 못했습니다.
                </Text>
            )}

            {profile && (
                <MenteeProfileSection profile={profile} userRole='MENTOR' />
            )}

            <Divider
                orientation="horizontal"
                borderBottomWidth="3px"
                borderColor="#F4F4F4"
                my="50px"
                opacity={1}
                borderStyle="solid"
            />

            <Box>
                <MentorPlannerSection menteeName={profile?.name ?? ''} />
            </Box>

            <Divider
                orientation="horizontal"
                borderBottomWidth="3px"
                borderColor="#F4F4F4"
                my="50px"
                opacity={1}
                borderStyle="solid"
            />

            <Box mb={10}>
                <MenteeWeaknessSection />
            </Box>

            <Grid
                templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                gap={8}
                mt={8}
            >
                <GridItem>
                    <WeeklyReportList />
                </GridItem>
                <GridItem>
                    <ZoomFeedbackList />
                </GridItem>
            </Grid>

            <Box h="100px" />
        </Box>
    );
};

export default MentorMenteeManagePage;
