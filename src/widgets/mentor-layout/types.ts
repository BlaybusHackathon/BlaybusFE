export interface MenteeNavItem {
  id: string;
  name: string;
}

export interface SidebarState {
  isMenteeListOpen: boolean;
  openMenteeIds: string[];
}