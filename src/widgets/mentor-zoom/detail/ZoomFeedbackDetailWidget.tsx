import { VStack, Textarea } from '@chakra-ui/react';
import { ZoomFeedbackSection } from './ZoomFeedbackSection';
import { SubjectFeedbackItem, SubjectType } from './SubjectFeedbackItem';
import { ZoomFeedbackData } from '@/widgets/mentor-zoom/model/mockZoomFeedbackData';

interface Props {
    data: ZoomFeedbackData;
    onChange: (field: string, value: any) => void;
}

export const ZoomFeedbackDetailWidget = ({ data, onChange }: Props) => {
    const handleSubjectChange = (subject: SubjectType, value: string) => {
        onChange('subjects', { ...data.subjects, [subject]: value });
    };

    return (
        <VStack spacing={8} align="stretch">
            <ZoomFeedbackSection title="메모장">
                <Textarea
                    value={data.memo}
                    onChange={(e) => onChange('memo', e.target.value)}
                    placeholder="자유롭게 메모를 남겨주세요."
                    minH="150px"
                    bg="#F9F9FB"
                    border="none"
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
                    resize="none"
                    lineHeight="1.6"
                />
            </ZoomFeedbackSection>

            <ZoomFeedbackSection title="줌 미팅 피드백 작성">
                <SubjectFeedbackItem
                    subject="korean"
                    value={data.subjects.korean}
                    onChange={(val) => handleSubjectChange('korean', val)}
                />
                <SubjectFeedbackItem
                    subject="english"
                    value={data.subjects.english}
                    onChange={(val) => handleSubjectChange('english', val)}
                />
                <SubjectFeedbackItem
                    subject="math"
                    value={data.subjects.math}
                    onChange={(val) => handleSubjectChange('math', val)}
                />
            </ZoomFeedbackSection>

            <ZoomFeedbackSection title="운영 피드백">
                <Textarea
                    value={data.operation}
                    onChange={(e) => onChange('operation', e.target.value)}
                    placeholder="운영 관련 피드백을 작성해주세요."
                    minH="150px"
                    bg="#F9F9FB"
                    border="none"
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
                    resize="none"
                    lineHeight="1.6"
                />
            </ZoomFeedbackSection>
        </VStack>
    );
};
