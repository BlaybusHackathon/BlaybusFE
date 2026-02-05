import { Box } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';
import { MenteeHeader } from './MenteeHeader';
import { MenteeBottomNav } from './MenteeBottomNav';

export const MenteeLayout = () => {
  const location = useLocation();

  // [페이지 제목 결정 로직]
  // 실제로는 recoil/zustand 상태나 라우터 핸들(handle)을 사용하는 게 좋지만, 
  // 여기서는 간단히 경로(pathname)로 처리합니다.
  let pageTitle = "홈";
  if (location.pathname.includes('/task')) pageTitle = "과제 확인";
  if (location.pathname.includes('/feedback')) pageTitle = "피드백";
  if (location.pathname.includes('/mypage')) pageTitle = "마이페이지";

  return (
    <Box minH="100vh" bg="white">
      {/* 1. Global Header (상단 고정) */}
      <MenteeHeader title={pageTitle} />

      {/* 2. Content Area (헤더/푸터 높이만큼 패딩) */}
      <Box 
        pt="56px"  // 헤더 높이만큼 띄움
        pb="64px"  // 푸터 높이만큼 띄움
        px={0}
      > 
        {/* [핵심] 여기에 자식 페이지(MenteeTaskDetailPage 등)가 렌더링됩니다 */}
        <Outlet />
      </Box>

      {/* 3. Global Footer (하단 고정) */}
      <MenteeBottomNav />
    </Box>
  );
};