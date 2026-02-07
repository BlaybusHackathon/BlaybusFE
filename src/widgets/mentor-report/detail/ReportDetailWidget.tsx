import { Box, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { ReportDateController } from './ReportDateController';
import { ReportSection } from './ReportSection';
import { ReportData } from '@/pages/mentor/mentee/report/mockReportData';

interface Props {
    data: ReportData;
    onChange: (field: string, value: string) => void;
}

export const ReportDetailWidget = ({ data, onChange }: Props) => {
    const [date, setDate] = useState({ year: 2026, month: 2, week: 1 });

    return (
        <Box>
            <ReportDateController
                year={date.year}
                month={date.month}
                week={date.week}
                onChangeYear={(y) => setDate((prev) => ({ ...prev, year: y }))}
                onChangeMonth={(m) => setDate((prev) => ({ ...prev, month: m }))}
                onChangeWeek={(w) => setDate((prev) => ({ ...prev, week: w }))}
            />

            <VStack spacing={8} align="stretch" mt={10}>
                <ReportSection
                    title="멘토 총평"
                    value={data.totalReview}
                    onChange={(val) => onChange('totalReview', val)}
                    placeholder="한 주간의 전반적인 학습 태도 및 성취도를 평가해주세요."
                />
                <ReportSection
                    title="이번주 잘한 점"
                    value={data.wellDone}
                    onChange={(val) => onChange('wellDone', val)}
                    placeholder="칭찬할 만한 성과나 행동을 적어주세요."
                    minH="100px"
                />
                <ReportSection
                    title="다음주 보완할 점"
                    value={data.improvements}
                    onChange={(val) => onChange('improvements', val)}
                    placeholder="개선이 필요한 부분 및 구체적인 가이드를 적어주세요."
                    minH="100px"
                />
            </VStack>
        </Box>
    );
};
