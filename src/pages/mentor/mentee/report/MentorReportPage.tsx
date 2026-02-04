import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Heading, Button, useToast, Container, Text } from '@chakra-ui/react';
import { DateSelector } from './ui/DateSelector';
import { ReportForm } from './ui/ReportForm';
import { MOCK_REPORT_DATA, ReportData } from './mockReportData';


// Mock API function
const fetchReport = async (year: number, month: number, week: number): Promise<ReportData | null> => {
    console.log(`Fetching report for ${year}-${month}-${week}`);
    const key = `${year}-${month}-${week}`;
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_REPORT_DATA[key] || null);
        }, 500); // Simulate network delay
    });
};

const saveReport = async (data: ReportData, isNew: boolean): Promise<void> => {
    console.log(`Saving report (${isNew ? 'POST' : 'PUT'})...`, data);
    return new Promise((resolve) => setTimeout(resolve, 500));
};

const MentorReportPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const toast = useToast();

    // Init state from URL or defaults
    const [year, setYear] = useState(Number(searchParams.get('year')) || new Date().getFullYear());
    const [month, setMonth] = useState(Number(searchParams.get('month')) || new Date().getMonth() + 1);
    const [week, setWeek] = useState(Number(searchParams.get('week')) || 1);

    const [reportData, setReportData] = useState<ReportData>({
        totalReview: '',
        wellDone: '',
        improvements: '',
    });
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch data when date changes
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchReport(year, month, week);
                if (data) {
                    setReportData(data);
                    setIsEditMode(true);
                } else {
                    setReportData({ totalReview: '', wellDone: '', improvements: '' });
                    setIsEditMode(false);
                }
            } catch (error) {
                console.error("Failed to fetch report", error);
                toast({
                    title: "데이터를 불러오는데 실패했습니다.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [year, month, week, toast]);

    // Update URL when date changes
    const handleDateChange = (y: number, m: number, w: number) => {
        setYear(y);
        setMonth(m);
        setWeek(w);
        setSearchParams({ year: String(y), month: String(m), week: String(w) });
    };

    const handleInputChange = (field: string, value: string) => {
        setReportData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!reportData.totalReview || !reportData.wellDone || !reportData.improvements) {
            toast({
                title: "모든 항목을 입력해주세요.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await saveReport(reportData, !isEditMode);
            toast({
                title: "저장되었습니다.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            setIsEditMode(true); // Switch to edit mode after save
        } catch (error) {
            console.error("Failed to save report", error);
            toast({
                title: "저장에 실패했습니다.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.lg" py={10}>
            <Heading as="h1" size="lg" mb={8} color="gray.800">
                주간 학습 리포트
            </Heading>

            <DateSelector year={year} month={month} week={week} onChange={handleDateChange} />

            {/* Date Display (Mock logic for day range) */}
            <Text color="gray.500" mb={10}>
                {month}월 {(week - 1) * 7 + 1}일 - {month}월 {week * 7}일
            </Text>

            <Box mb={20}>
                <ReportForm data={reportData} onChange={handleInputChange} />
            </Box>

            {/* Fixed Bottom Button */}
            <Box position="fixed" bottom={0} left={0} right={0} p={4} bg="white" borderTop="1px solid" borderColor="gray.200" zIndex={10}>
                <Container maxW="container.lg" display="flex" justifyContent="flex-end" gap={4}>
                    <Button variant="outline" size="lg" minW="100px">취소</Button>
                    <Button colorScheme="blue" size="lg" minW="100px" onClick={handleSave} isLoading={loading}>
                        저장
                    </Button>
                </Container>
            </Box>

            {/* Spacer for fixed button */}
            <Box h="100px" />
        </Container>
    );
};

export default MentorReportPage;
