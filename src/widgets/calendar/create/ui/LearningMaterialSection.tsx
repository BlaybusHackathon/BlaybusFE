import React from 'react';
import { useScheduleCreateStore } from '../model/store';
import { DAYS } from '../model/mockData';

export const LearningMaterialSection = () => {
    const { selectedDays, materialsByDay, setMaterialForDay } = useScheduleCreateStore();

    // Sort selected days to match the order in DAYS (e.g., Mon -> Sun)
    const sortedSelectedDays = DAYS.filter((day) => selectedDays.includes(day.value));

    const handleFileChange = (dayValue: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            // In a real app, we would upload the file here.
            // For now, we simulate a file object with a path.
            setMaterialForDay(dayValue, {
                fullPath: URL.createObjectURL(file), // Mock path
                name: file.name,
                size: file.size,
            });
        }
    };

    const handleRemoveFile = (dayValue: string) => {
        setMaterialForDay(dayValue, null);
    };

    if (sortedSelectedDays.length === 0) {
        return null;
    }

    return (
        <div className="mb-8 animate-fadeIn">
            <label className="block text-lg font-bold text-gray-900 mb-3">학습지</label>
            <div className="space-y-3">
                {sortedSelectedDays.map((day) => {
                    const material = materialsByDay[day.value];

                    return (
                        <div key={day.value} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-500 font-bold flex items-center justify-center shrink-0">
                                {day.label}
                            </div>

                            <div className="flex-1">
                                {material ? (
                                    <div className="flex items-center justify-between px-4 py-3 bg-white border border-blue-200 rounded-lg">
                                        <span className="text-gray-900 truncate">{material.name}</span>
                                        <button
                                            onClick={() => handleRemoveFile(day.value)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 8.586 5.707 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id={`file-${day.value}`}
                                            className="hidden"
                                            onChange={(e) => handleFileChange(day.value, e)}
                                        />
                                        <label
                                            htmlFor={`file-${day.value}`}
                                            className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            학습지 업로드
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
