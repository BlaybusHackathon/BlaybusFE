import {
  EditIcon,
  ChatIcon,
  CalendarIcon
} from '@chakra-ui/icons';
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
          label: '플래너',
          path: '/mentee/planner',
          icon: EditIcon
        },
        {
          label: '캘린더',
          path: '/mentee/calendar',
          icon: CalendarIcon
        },
        {
          label: '피드백',
          path: '/mentee/feedback',
          icon: ChatIcon
        },
        {
          label: '마이페이지',
          path: '/mentee/mypage',
          icon: UserProfileIcon
        },
      ];

    case 'MENTOR':
      return [
        {
          label: '마이페이지',
          path: '/mentor/mypage',
          icon: UserProfileIcon
        },
      ];

    default:
      return [];
  }
};