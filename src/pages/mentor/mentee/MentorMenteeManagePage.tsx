import { Box, Text, Grid, GridItem } from '@chakra-ui/react';
import { MenteeProfileSection } from '../../../widgets/mentee-profile/ui/MenteeProfileSection';
import { MentorPlannerSection } from '@/widgets/mentor-planner';
import { MenteeWeaknessSection } from '@/widgets/mentor-weakness/ui/MenteeWeaknessSection';
import { WeeklyReportList } from '@/widgets/mentor-report/ui/WeeklyReportList';
import { ZoomFeedbackList } from '@/widgets/mentor-zoom/ui/ZoomFeedbackList';
import { MOCK_MENTEE_PROFILE } from './model/mockData';

const MentorMenteeManagePage = () => {
    return (
        <Box maxW="1200px" mx="auto" py={6} px={{ base: 4, md: 0 }}>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>담당 멘티</Text>

            <MenteeProfileSection profile={MOCK_MENTEE_PROFILE} userRole='MENTOR' />

            <Box mt={8}>
                <MentorPlannerSection />
            </Box>

            <Box mt={8}>
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
