import { 
  CalendarIcon, 
  ChatIcon, 
  SettingsIcon, 
  ViewIcon,
  EditIcon
} from '@chakra-ui/icons'; 
import { UserRole } from '@/shared/constants/enums';

export interface NavItem {
  label: string;
  icon: any;
  path: string;
}

export const getNavItems = (role: UserRole): NavItem[] => {
  if (role === "MENTOR") {
    return [
      { label: '홈', icon: ViewIcon, path: '/mentor' }, 
      { label: '학생 관리', icon: ChatIcon, path: '/mentor/mentee' },
      { label: '마이페이지', icon: SettingsIcon, path: '/mentor/mypage' },
    ];
  } else {
    // MENTEE
    return [
      { label: '플래너', icon: CalendarIcon, path: '/mentee/planner' },
      { label: '피드백', icon: EditIcon, path: '/mentee/feedback' },
      { label: '마이페이지', icon: SettingsIcon, path: '/mentee/mypage' },
    ];
  }
};