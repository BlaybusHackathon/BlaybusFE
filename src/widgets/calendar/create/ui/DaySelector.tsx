import React from 'react';
import { useScheduleCreateStore } from '../model/store';
import { DAYS, WEEKS } from '../model/mockData';
import classNames from 'classnames';

export const DaySelector = () => {
    const { selectedWeek, setSelectedWeek, selectedDays, toggleDay } = useScheduleCreateStore();

    return (
        <div className="mb-8">
            <label className="block text-lg font-bold text-gray-900 mb-3">요일 선택</label>
            <div className="flex flex-wrap items-center gap-2">
                {/* Week Selector */}
                <div className="relative">
                    <select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        className="px-4 py-2 pr-8 bg-white border border-blue-200 rounded-lg text-gray-700 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors appearance-none cursor-pointer min-w-[100px]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%233b82f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                        {WEEKS.map((week) => (
                            <option key={week} value={week}>{week}</option>
                        ))}
                    </select>
                </div>

                {/* Day Toggles */}
                {DAYS.map((day) => (
                    <button
                        key={day.value}
                        onClick={() => toggleDay(day.value)}
                        className={classNames(
                            'w-10 h-10 rounded-lg border flex items-center justify-center transition-all',
                            selectedDays.includes(day.value)
                                ? 'bg-blue-400 text-white border-blue-400 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                        )}
                    >
                        {day.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
