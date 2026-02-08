import { create } from 'zustand';
import { ScheduleCreateState, Subject } from './types';

interface ScheduleCreateActions {
    setSubject: (subject: Subject | null) => void;
    toggleWeakness: () => void;
    setSelectedWeaknessId: (id: string | null) => void;

    setSelectedWeek: (week: string) => void;
    toggleDay: (day: string) => void;

    setTitle: (title: string) => void;

    addWorksheet: () => void;
    removeWorksheet: (id: string) => void;
    updateWorksheetFile: (id: string, file: { name: string; size?: number; fullPath: string; rawFile?: File }) => void;
    toggleWorksheetDay: (id: string, day: string) => void;

    reset: () => void;
}

const initialState: ScheduleCreateState = {
    subject: 'KOREAN', // Default to Korean
    isWeaknessSelected: false,
    selectedWeaknessId: null,
    selectedWeek: '1주차',
    selectedDays: [],
    title: '',
    worksheets: [],
};

export const useScheduleCreateStore = create<ScheduleCreateState & ScheduleCreateActions>((set) => ({
    ...initialState,

    setSubject: (subject) => set({ subject }),
    toggleWeakness: () => set((state) => ({ isWeaknessSelected: !state.isWeaknessSelected })),
    setSelectedWeaknessId: (id) => set({ selectedWeaknessId: id }),

    setSelectedWeek: (week) => set({ selectedWeek: week }),

    // Global Day Toggle
    toggleDay: (day) => set((state) => {
        const isSelected = state.selectedDays.includes(day);
        const newGlobalDays = isSelected
            ? state.selectedDays.filter((d) => d !== day)
            : [...state.selectedDays, day];

        // Sync worksheets count with selected days count
        let newWorksheets = [...state.worksheets];
        const diff = newGlobalDays.length - newWorksheets.length;

        if (diff > 0) {
            // Add new worksheets
            for (let i = 0; i < diff; i++) {
                newWorksheets.push({
                    id: crypto.randomUUID(),
                    file: null,
                    selectedDays: [], // User will select which specific days
                });
            }
        } else if (diff < 0) {
            // Remove worksheets from the end (simple approach) or filtering could be complex
            // User request implies simple "2 lines appear".
            newWorksheets = newWorksheets.slice(0, newGlobalDays.length);
        }

        // Also ensure that for remaining worksheets, we remove any selectedDays that are no longer in global scope
        newWorksheets = newWorksheets.map(ws => ({
            ...ws,
            selectedDays: ws.selectedDays.filter(d => newGlobalDays.includes(d))
        }));

        return { selectedDays: newGlobalDays, worksheets: newWorksheets };
    }),

    setTitle: (title) => set({ title }),

    // Worksheet Actions
    addWorksheet: () => set((state) => ({
        worksheets: [
            ...state.worksheets,
            {
                id: crypto.randomUUID(),
                file: null,
                selectedDays: [], // Initially no days selected
            },
        ],
    })),

    removeWorksheet: (id) => set((state) => ({
        worksheets: state.worksheets.filter((ws) => ws.id !== id),
    })),

    updateWorksheetFile: (id, file) => set((state) => ({
        worksheets: state.worksheets.map((ws) =>
            ws.id === id ? { ...ws, file } : ws
        ),
    })),

    toggleWorksheetDay: (id, day) => set((state) => ({
        worksheets: state.worksheets.map((ws) => {
            if (ws.id !== id) return ws;

            const isDaySelected = ws.selectedDays.includes(day);
            return {
                ...ws,
                selectedDays: isDaySelected
                    ? ws.selectedDays.filter((d) => d !== day)
                    : [...ws.selectedDays, day],
            };
        }),
    })),

    reset: () => set(initialState),
}));
