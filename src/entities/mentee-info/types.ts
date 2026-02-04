export interface MenteeInfo {
  id: string;
  schoolName: string;
  koreanGrade: number | null;
  mathGrade: number | null;
  englishGrade: number | null;
  createdAt: string;
  updatedAt: string | null;
  mentorId: string;
  menteeId: string;
}

export const mapMenteeInfoFromApi = (raw: any): MenteeInfo => ({
  id: String(raw.id),
  schoolName: raw.school_name,
  koreanGrade: raw.korean_grade,
  mathGrade: raw.math_grade,
  englishGrade: raw.english_grade,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  mentorId: String(raw.mentor_id),
  menteeId: String(raw.mentee_id),
});