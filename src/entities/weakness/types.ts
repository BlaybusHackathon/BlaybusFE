export interface Weakness {
  id: string;
  title: string;
  inforId: string;
  contentId: string;
}

export const mapWeaknessFromApi = (raw: any): Weakness => ({
  id: String(raw.id),
  title: raw.title,
  inforId: String(raw.infor_id),
  contentId: String(raw.content_id),
});