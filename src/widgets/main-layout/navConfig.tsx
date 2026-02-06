
import { 
    HomeIcon,
    CalendarIcon,
    FeedbackIcon,
    MypageIcon,
    MenteeIcon
} from '@/shared/ui/icons';
import { UserRole } from '@/shared/constants/enums';
import { UserProfileIcon } from '@/shared/ui/UserProfileIcon';

export interface NavItem {
  label: string;
  path: string;
  icon: any;
}

export const getNavItems = (role: UserRole): NavItem[] => {
  switch (role) {
    case 'MENTEE':
      return [

        { 
          label: '홈', 
          path: '/mentee/planner', 
          icon: HomeIcon 
        },
        {
          label: '캘린더',
          path: '/mentee/calendar',
          icon: CalendarIcon
        },

        { 
          label: '피드백', 
          path: '/mentee/feedback', 
          icon: FeedbackIcon 
        },
        { 
          label: '마이페이지', 
          path: '/mentee/mypage', 
          icon: MypageIcon 
        },
      ];

    case 'MENTOR':
      return [

        { 
          label: '멘티 관리', 
          path: '/mentor', 
          icon: MenteeIcon 
        },
        { 
          label: '데시보드', 
          path: '/mentor/mypage', 
          icon: HomeIcon 
        },
      ];

    default:
      return [];
  }
};