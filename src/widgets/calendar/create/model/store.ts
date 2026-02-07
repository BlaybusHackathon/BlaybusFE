import { create } from 'zustand';
import { ScheduleCreateState, Subject, LearningMaterial } from './types';

interface ScheduleCreateActions {
    setSubject: (subject: Subject | null) => void;
    toggleWeakness: () => void;
    setSelectedWeaknessId: (id: string | null) => void;

    setSelectedWeek: (week: string) => void;
    toggleDay: (day: string) => void;

    setTitle: (title: string) => void;

    setMaterialForDay: (day: string, material: LearningMaterial | null) => void;
    reset: () => void;
}

const initialState: ScheduleCreateState = {
    subject: 'KOREAN', // Default to Korean
    isWeaknessSelected: false,
    selectedWeaknessId: null,
    selectedWeek: '1주차',
    selectedDays: [],
    title: '',
    materialsByDay: {},
};

export const useScheduleCreateStore = create<ScheduleCreateState & ScheduleCreateActions>((set) => ({
    ...initialState,

    setSubject: (subject) => set({ subject }),
    toggleWeakness: () => set((state) => ({ isWeaknessSelected: !state.isWeaknessSelected })),
    setSelectedWeaknessId: (id) => set({ selectedWeaknessId: id }),

    setSelectedWeek: (week) => set({ selectedWeek: week }),
    toggleDay: (day) => set((state) => {
        const isSelected = state.selectedDays.includes(day);
        const newDays = isSelected
            ? state.selectedDays.filter((d) => d !== day)
            : [...state.selectedDays, day];

        // Remove material if day is deselected
        const newMaterials = { ...state.materialsByDay };
        if (isSelected) {
            delete newMaterials[day];
        }

        return { selectedDays: newDays, materialsByDay: newMaterials };
    }),

    setTitle: (title) => set({ title }),

    setMaterialForDay: (day, material) => set((state) => ({
        materialsByDay: {
            ...state.materialsByDay,
            [day]: material,
        },
    })),

    reset: () => set(initialState),
}));
