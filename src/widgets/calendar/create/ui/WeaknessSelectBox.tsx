import React from 'react';
import { useScheduleCreateStore } from '../model/store';
import { MOCK_WEAKNESSES } from '../model/mockData';

export const WeaknessSelectBox = () => {
    const { subject, isWeaknessSelected, selectedWeaknessId, setSelectedWeaknessId } = useScheduleCreateStore();

    // Show only if both a subject is selected AND weakness mode is toggled on
    if (!subject || !isWeaknessSelected) return null;

    const filteredWeaknesses = MOCK_WEAKNESSES.filter((w) => w.subject === subject);

    return (
        <div className="mb-8 animate-fadeIn">
            <label className="block text-lg font-bold text-gray-900 mb-3">보완점</label>
            <div className="w-full">
                <select
                    value={selectedWeaknessId || ''}
                    onChange={(e) => setSelectedWeaknessId(e.target.value)}
                    className="w-full p-3 bg-white border border-pink-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-shadow appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                    <option value="">보완점 강의/오답노트 선택</option>
                    {filteredWeaknesses.map((w) => (
                        <option key={w.id} value={w.id}>
                            {w.label}
                        </option>
                    ))}
                </select>
                {filteredWeaknesses.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">해당 과목에 등록된 보완점 자료가 없습니다.</p>
                )}
            </div>
        </div>
    );
};
