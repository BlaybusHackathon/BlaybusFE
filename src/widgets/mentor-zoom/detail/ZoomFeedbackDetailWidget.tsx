import { VStack, Textarea } from '@chakra-ui/react';
import { ZoomFeedbackSection } from './ZoomFeedbackSection';
import { SubjectFeedbackItem, SubjectType } from './SubjectFeedbackItem';
import { ZoomFeedbackData } from '@/widgets/mentor-zoom/model/mockZoomFeedbackData';

interface Props {
    data: ZoomFeedbackData;
    onChange: (field: string, value: any) => void;
    readOnly?: boolean;
}

export const ZoomFeedbackDetailWidget = ({ data, onChange, readOnly = false }: Props) => {
    const handleSubjectChange = (subject: SubjectType, value: string) => {
        onChange('subjects', { ...data.subjects, [subject]: value });
    };

    return (
        <VStack spacing={8} align="stretch">
            <ZoomFeedbackSection title="메모장">
                <Textarea
                    value={data.memo}
                    onChange={(e) => !readOnly && onChange('memo', e.target.value)}
                    isReadOnly={readOnly}
                    placeholder={readOnly ? "" : "자유롭게 메모를 남겨주세요."}
                    minH="150px"
                    bg={readOnly ? "white" : "#F9F9FB"}
                    border={readOnly ? "1px solid" : "none"}
                    borderColor={readOnly ? "#E2E4E8" : "transparent"}
                    borderRadius="12px"
                    p={6}
                    fontSize="16px"
                    color="#7E7E7E"
                    _placeholder={{ color: '#9B9BA4' }}
                    _focus={{
                        bg: 'white',
                        border: '1px solid',
                        borderColor: '#53A8FE',
                        boxShadow: 'none'
                    }}
                    sx={{
                        fieldSizing: 'content',
                        height: 'initial',
                    }}
                    resize="none"
                    lineHeight="1.6"
                />
            </ZoomFeedbackSection>

            <ZoomFeedbackSection title="과목별 피드백">
                <SubjectFeedbackItem
                    subject="korean"
                    value={data.subjects.korean}
                    onChange={(val) => handleSubjectChange('korean', val)}
                    readOnly={readOnly} // [전달]
                />
                <SubjectFeedbackItem
                    subject="english"
                    value={data.subjects.english}
                    onChange={(val) => handleSubjectChange('english', val)}
                    readOnly={readOnly} // [전달]
                />
                <SubjectFeedbackItem
                    subject="math"
                    value={data.subjects.math}
                    onChange={(val) => handleSubjectChange('math', val)}
                    readOnly={readOnly} // [전달]
                />
            </ZoomFeedbackSection>

            <ZoomFeedbackSection title="운영 피드백">
                <Textarea
                    value={data.operation}
                    onChange={(e) => !readOnly && onChange('operation', e.target.value)}
                    isReadOnly={readOnly}
                    placeholder={readOnly ? "" : "운영 관련 피드백을 작성해주세요."}
                    minH="150px"
                    bg={readOnly ? "white" : "#F9F9FB"}
                    border={readOnly ? "1px solid" : "none"}
                    borderColor={readOnly ? "#E2E4E8" : "transparent"}
                    borderRadius="12px"
                    p={6}
                    fontSize="16px"
                    color="#7E7E7E"
                    _placeholder={{ color: '#9B9BA4' }}
                    _focus={{
                        bg: 'white',
                        border: '1px solid',
                        borderColor: '#53A8FE',
                        boxShadow: 'none'
                    }}
                    sx={{
                        fieldSizing: 'content',
                        height: 'initial',
                    }}
                    resize="none"
                    lineHeight="1.6"
                />
            </ZoomFeedbackSection>
        </VStack>
    );
};