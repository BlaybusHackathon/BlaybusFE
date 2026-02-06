import { Box, Text, Grid, GridItem, Divider } from '@chakra-ui/react';
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

            <Divider
                orientation="horizontal"
                borderBottomWidth="3px"
                borderColor="#F4F4F4"
                my="50px"
                opacity={1}
                borderStyle="solid"
            />

            <Box>
                <MentorPlannerSection menteeName={MOCK_MENTEE_PROFILE.name} />
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
