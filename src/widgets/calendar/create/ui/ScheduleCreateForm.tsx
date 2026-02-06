import React from 'react';
import { SubjectSection } from './SubjectSection';
import { WeaknessSelectBox } from './WeaknessSelectBox';
import { DaySelector } from './DaySelector';

export const ScheduleCreateForm = () => {
    return (
        <div className="w-full h-full flex flex-col p-8">
            <h1 className="text-2xl font-bold mb-4">일정 만들기</h1>
            <p className="text-gray-500 mb-8">학생의 학습 성향에 맞는 과제를 설정해주세요.</p>

            {/* Placeholder for content */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center text-gray-400">
                폼 내용이 여기에 들어갑니다.
            </div>
        </div>
    );
};
