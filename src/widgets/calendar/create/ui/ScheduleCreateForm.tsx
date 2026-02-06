import React from 'react';
import { SubjectSection } from './SubjectSection';
import { WeaknessSelectBox } from './WeaknessSelectBox';
import { DaySelector } from './DaySelector';
import { LearningMaterialSection } from './LearningMaterialSection';


export const ScheduleCreateForm = () => {
    return (
        <div className="w-full h-full flex flex-col p-8">
            <h1 className="text-2xl font-bold mb-4">일정 만들기</h1>
            <p className="text-gray-500 mb-8">학생의 학습 성향에 맞는 과제를 설정해주세요.</p>

            <div className="flex-1 bg-white rounded-lg p-8 shadow-sm overflow-y-auto">
                <SubjectSection />

                <div className="mb-8">
                    <label className="block text-lg font-bold text-gray-900 mb-3">제목</label>
                    <input
                        type="text"
                        placeholder="제목을 입력하세요 (예: 독서 2지문 (2))"
                        className="w-full p-4 border border-blue-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400 transition-shadow"
                    />
                </div>

                <WeaknessSelectBox />

                <DaySelector />

                <LearningMaterialSection />

                <div className="mt-12 flex justify-end gap-3">
                    <button className="px-8 py-3 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                        취소
                    </button>
                    <button className="px-8 py-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-md transition-all transform hover:-translate-y-0.5">
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};
