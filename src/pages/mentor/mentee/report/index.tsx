import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Heading, Button, useToast, Container, Text } from '@chakra-ui/react';
import { DateSelector } from './components/DateSelector';
import { ReportForm } from './components/ReportForm';

interface ReportData {
    id?: string;
    totalReview: string;
    wellDone: string;
    improvements: string;
}

// Mock API function
const fetchReport = async (year: number, month: number, week: number): Promise<ReportData | null> => {
    console.log(`Fetching report for ${year}-${month}-${week}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Logic to return mock data for demo purposes if year is 2026, month 2, week 1
            if (year === 2026 && month === 2 && week === 1) {
                resolve({
                    id: '1',
                    totalReview:
                        '첫 주 동안 새로운 학습 흐름에 적응하느라 쉽지 않았을 텐데, 전반적으로 계획한 학습을 따라가려는 태도가 잘 보였습니다. 고3이라는 상황 속에서도 학습을 미루지 않고 시작했다는 점 자체가 이번 주의 가장 중요한 성과입니다.\n\n아직 공부 속도나 집중력 면에서는 다소 들쭉날쭉한 부분이 있지만, 이는 초반에 충분히 나타날 수 있는 자연스러운 과정입니다. 중요한 것은 완벽함보다는 흐름을 만들려는 시도였고, 이번 주를 통해 본인에게 필요한 학습 리듬을 조금씩 파악해 가고 있다는 점이 긍정적으로 보입니다.\n\n다음 주에는 이번 주에 느꼈던 어려움이나 막히는 지점을 조금 더 명확히 정리해보는 것이 좋겠습니다.',
                    wellDone: '과제를 대하는 태도에서 성실함이 느껴졌습니다. 모든 내용을 완벽하게 소화하지는 못했더라도, 정해진 목표를 인식하고 끝까지 마무리하려는 자세가 인상적이었습니다.',
                    improvements: '학습량을 늘리기보다는, 자신에게 맞는 속도와 방식을 찾는 데 집중해보길 바랍니다.',
                });
            } else {
                resolve(null);
            }
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
