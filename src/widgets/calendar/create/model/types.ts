export type Subject = 'KOREAN' | 'MATH' | 'ENGLISH';

export interface Weakness {
    id: string;
    label: string;
    subject: Subject;
}

export interface LearningMaterial {
    fullPath: string; // File path or URL
    name: string;
    size?: number; // Optional size
}

export interface DaySchedule {
    dayOfWeek: string; // 'MONDAY', 'WEDNESDAY', etc.
    material: LearningMaterial | null;
}

export interface ScheduleCreateState {
    subject: Subject | null;
    isWeaknessSelected: boolean;
    selectedWeaknessId: string | null;

    selectedWeek: string; // e.g., '1주차'
    selectedDays: string[]; // ['MONDAY', 'WEDNESDAY']

    title: string;

    // Mapping day of week to specific material
    // Key: dayOfWeek (e.g., 'MONDAY'), Value: uploaded file info
    materialsByDay: Record<string, LearningMaterial | null>;
}
