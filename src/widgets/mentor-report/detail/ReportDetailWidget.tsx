import { Box, VStack } from '@chakra-ui/react';
import { ReportSection } from './ReportSection';
import { ReportDateController } from './ReportDateController';
import { ReportData } from '@/widgets/mentor-report/model/mockReportData';

interface Props {
    data: ReportData;
    dateInfo: {
        year: number;
        month: number;
        week: number;
    };
    onChange: (field: string, value: string) => void;
    readOnly?: boolean; // [추가]
}

export const ReportDetailWidget = ({ data, dateInfo, onChange, readOnly = false }: Props) => {
    return (
        <Box>
            <ReportDateController
                year={dateInfo.year}
                month={dateInfo.month}
                week={dateInfo.week}
                onChangeYear={() => {}} 
                onChangeMonth={() => {}}
                onChangeWeek={() => {}}
            />

            <VStack spacing={8} align="stretch" mt={10}>
                <ReportSection
                    title="멘토 총평"
                    value={data.totalReview}
                    onChange={(val) => onChange('totalReview', val)}
                    placeholder="한 주간의 전반적인 학습 태도 및 성취도를 평가해주세요."
                    readOnly={readOnly}
                />
                <ReportSection
                    title="이번주 잘한 점"
                    value={data.wellDone}
                    onChange={(val) => onChange('wellDone', val)}
                    placeholder="칭찬할 만한 성과나 행동을 적어주세요."
                    minH="100px"
                    readOnly={readOnly}
                />
                <ReportSection
                    title="다음주 보완할 점"
                    value={data.improvements}
                    onChange={(val) => onChange('improvements', val)}
                    placeholder="개선이 필요한 부분 및 구체적인 가이드를 적어주세요."
                    minH="100px"
                    readOnly={readOnly}
                />
            </VStack>
        </Box>
    );
};