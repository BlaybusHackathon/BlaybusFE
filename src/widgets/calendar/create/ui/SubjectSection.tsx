import React from 'react';
import { useScheduleCreateStore } from '../model/store';
import { Subject } from '../model/types';

export const SubjectSection = () => {
    const { subject, isWeaknessSelected, setSubject, toggleWeakness } = useScheduleCreateStore();

    const subjects: { label: string; value: Subject; colorClass: string; activeColorClass: string }[] = [
        { label: '국어', value: 'KOREAN', colorClass: 'hover:bg-blue-50 text-blue-500 border-blue-200', activeColorClass: 'bg-blue-500 text-white border-blue-500' },
        { label: '영어', value: 'ENGLISH', colorClass: 'hover:bg-purple-50 text-purple-500 border-purple-200', activeColorClass: 'bg-purple-500 text-white border-purple-500' },
        { label: '수학', value: 'MATH', colorClass: 'hover:bg-orange-50 text-orange-500 border-orange-200', activeColorClass: 'bg-orange-500 text-white border-orange-500' },
    ];

    return (
        <div className="mb-8">
            <label className="block text-lg font-bold text-gray-900 mb-3">과목</label>
            <div className="flex items-center gap-2">
                {subjects.map((sub) => (
                    <button
                        key={sub.value}
                        onClick={() => setSubject(sub.value)}
                        className={`px-6 py-2 rounded-lg border transition-colors font-medium ${subject === sub.value ? sub.activeColorClass : `bg-white border-gray-200 text-gray-500 ${sub.colorClass}`
                            }`}
                    >
                        {sub.label}
                    </button>
                ))}

                <button
                    onClick={toggleWeakness}
                    className={`px-6 py-2 rounded-lg border transition-colors font-medium ml-2 ${isWeaknessSelected
                            ? 'bg-blue-400 text-white border-blue-400'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    보완점
                </button>
            </div>
        </div>
    );
};
