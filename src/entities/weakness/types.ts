import { Subject } from '@/shared/constants/subjects';

export interface Weakness {
  id: string;       
  title: string;    
  inforId: string;   
  contentId: string; 

  menteeId: string; 
  subject: Subject; 
  fileName?: string;
  fileUrl?: string;  
}

export const mapWeaknessFromApi = (raw: any): Weakness => ({
  id: String(raw.id),
  title: raw.title,
  inforId: String(raw.infor_id),
  contentId: String(raw.content_id),

  menteeId: String(raw.mentee_id), 
  subject: raw.subject,            
  fileName: raw.file_name || raw.study_content?.title,
  fileUrl: raw.file_url || raw.study_content?.content_url, 
});