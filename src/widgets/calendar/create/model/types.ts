export type Subject = 'KOREAN' | 'MATH' | 'ENGLISH';

export interface Weakness {
    id: string;
    label: string;
    subject: Subject;
}

// export interface LearningMaterial {
//     fullPath: string; // File path or URL
//     name: string;
//     size?: number; // Optional size
// }

export interface Worksheet {
    id: string;
    file: {
        name: string;
        size?: number;
        fullPath: string; // File path or URL
        rawFile?: File;
    } | null;
    selectedDays: string[]; // Days assigned to this specific worksheet
}

export interface ScheduleCreateState {
    subject: Subject | null;
    isWeaknessSelected: boolean;
    selectedWeaknessId: string | null;

    selectedWeek: string; // e.g., '1주차'
    selectedDays: string[]; // ['MONDAY', 'WEDNESDAY'] - Global selected days

    title: string;

    // List of worksheets
    worksheets: Worksheet[];
}
