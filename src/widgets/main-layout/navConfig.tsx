import type { ComponentType, SVGProps } from 'react';

import {
  HomeIcon,
  CalendarIcon,
  FeedbackIcon,
  MypageIcon,
} from '@/shared/ui/icons';
import { UserRole } from '@/shared/constants/enums';

export interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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
          label: '마이페이지',
          path: '/mentor/mypage',
          icon: MypageIcon
        },
      ];

    default:
      return [];
  }
};