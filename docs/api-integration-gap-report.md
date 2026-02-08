# API 연동 현황 분석 및 우선순위
기준일: 2026-02-08  
기준 문서: `docs/프론트엔드_API_연동_가이드.pdf`

**요약**
- 공통 응답 래퍼 없음(백엔드). 프론트는 래퍼/비래퍼 혼합 처리 중이며 타입 에러 존재.
- 시간 단위는 초(Seconds) 기준. 프론트 일부가 분/초 변환을 수행해 값 왜곡 위험.
- User 필드명(`nickname`) 및 선택 필드 처리 불일치.
- Feedback 좌표는 0.0~1.0 범위. 프론트는 0~100 가정이 섞여 있어 쓰기 시 스케일 조정 필요.
- 캘린더는 백엔드 `/plans/calendar`, `/plans/calendar/weekly` 제공. 프론트는 `/tasks/list` 기반 우회 구현.
- 알림 상세 이동을 위한 `targetType/targetId`가 현재 응답에 없음.

**우선순위 정의**
1. P0: 런타임 오류/데이터 왜곡/핵심 흐름 불가
2. P1: 화면 기능 완성/정합성 문제
3. P2: 품질 개선 및 확장

**기능별 연동 상태 요약**
| 기능 | API | 상태 | 비고 |
|---|---|---|---|
| Auth | `/auth/login`, `/users/me` | 연결됨 | 토큰은 헤더에서 수신 |
| User | `/users/me`, `/users/me/profile`, `/users/me/fcm-token` | 연결됨(부분) | `nickname` 필드명 불일치, 선택 필드 처리 필요 |
| Notifications | `/notifications`, `/notifications/{id}/read`, `/notifications/read-all` | 연결됨(부분) | 상세 이동을 위한 `targetType/targetId` 필요 |
| Mentoring | `/mentor/mentees`, `/mentee/mentor` | 연결됨 | mentee list 응답 필드 수정 반영 필요 |
| Mentor Dashboard | `/mentor/dashboard` | 연결됨 | 스펙과 타입 정합화 필요 |
| Mentee Dashboard | `/mentor/{menteeId}`, `/mentee/me` | 연결됨 | 진행률/카운트 필드 매핑 확인 |
| Planner | `/plans`, `/plans/{id}/feedback` | 연결됨 | totalStudyTime 단위 불일치 |
| Calendar | `/plans/calendar`, `/plans/calendar/weekly` | 미정합 | 현재 `/tasks/list` 기반 구현 |
| Task | `/tasks`, `/tasks/{id}`, `/mentor/tasks/list/{menteeId}`, `/mentee/tasks/list` | 연결됨 | 타이머 응답 필드명 불일치 |
| Submission | `/tasks/{id}/submissions` | 연결됨 | 이미지 id/URL 매핑 유지 |
| Feedback | `/images/{imageId}/feedback`, `/feedback/{id}` | 연결됨(부분) | 좌표 0~1 스케일 정합 필요 |
| Comment | `/feedback/{id}/comments` | 연결됨 | 응답 authorId 누락(필요 시 백엔드 요청) |
| Weakness | `/mentor/weakness`, `/mentor/weakness/{menteeId}`, `/mentee/weakness/me` | 연결됨(부분) | 멘티 조회 경로 연동 확인 필요 |
| Study Content | `/study-contents` | 연결됨(부분) | 삭제/리스트 호출 매핑 확인 필요 |
| Weekly Report | `/mentor/weekly-report`, `/weekly-reports` | 연결됨(부분) | 응답에 menteeId 필요 시 요청 |
| Zoom Feedback | `/mentor/zoom-feedback/{menteeId}`, `/mentor/list/{menteeId}` | 연결됨(부분) | 리스트 경로 확인 필요 |

**P0 이슈 (즉시 수정 대상)**
1. `apiClient` 응답 처리 타입 오류
- 증상: Axios interceptor 타입 에러, 래퍼/비래퍼 혼용 타입 불일치.
- 조치: 응답 래퍼 타입가드 추가, 인터셉터 반환 타입 정리, 에러 파서에 `{code,message}` 대응.

2. 시간 단위 불일치
- 백엔드: `totalStudyTime`, `duration`, `sessionSeconds`는 초(Seconds).
- 프론트: `* 60` 변환 적용됨.
- 조치: 변환 제거, 타이머 응답 `sessionSeconds` 우선 사용.

3. User 필드명 불일치
- 백엔드: `nickname`.
- 프론트: `nickName`.
- 조치: 맵핑에서 `nickname` 허용, 업데이트 요청 시 `nickname` 전송.

4. Feedback 좌표 스케일
- 백엔드: 0.0 ~ 1.0.
- 프론트: 0 ~ 100 표시.
- 조치: 저장 시 0~1로 변환(표시는 0~100 유지).

**P1 이슈 (정합성/기능 완성)**
1. 캘린더 데이터 소스
- 백엔드: `/plans/calendar`, `/plans/calendar/weekly` 제공.
- 프론트: `/tasks/list`로 우회 구현.
- 조치: 캘린더 호출을 공식 엔드포인트로 변경.

2. 알림 상세 이동 정보 부족
- 현재 응답: id/type/message/isRead/createdAt.
- 필요: `targetType`, `targetId`, `targetTitle`.
- 조치: 백엔드 응답 필드 추가 요청.

3. 피드백 강조 태그 처리
- 백엔드: `<강조>` 태그 포함 가능.
- 프론트: 일반 텍스트 처리.
- 조치: 뷰 레벨에서 강조 처리 로직 추가.

**P2 이슈 (품질/확장)**
1. 에러 구조 통일
- `{status,message}`와 `{code,message}` 모두 처리.
- Validation 에러 포맷에 대한 메시지 표준화.

2. 모킹 데이터 정합화
- 실제 API 스키마와 값 범위 일치시키기.

**백엔드 추가 요청 사항**
1. Notification: `targetType`, `targetId`, `targetTitle` 응답 포함
2. Feedback/Comment: 필요 시 `authorId` 또는 `userId` 포함
3. WeeklyReport: 리스트 응답에 `menteeId` 포함 필요 여부 확인
4. Calendar: `weekly` 응답 필드 확정

**다음 작업(우선순위 실행)**
1. P0 항목부터 코드 수정 진행
2. P1 항목은 백엔드 협의 후 연동 변경
3. P2 항목은 안정화 단계에서 처리
