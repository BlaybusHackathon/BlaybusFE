import { apiClient } from '@/shared/api/base';
import type { ReportData } from '@/features/report/model/types';
import { getMonth, getWeekOfMonth, getYear, parseISO } from 'date-fns';
import { USE_MOCK } from '@/shared/mocks/mockEnv';
import { mockApi } from '@/shared/mocks/mockApi';
import { asRecord, asString, asOptionalString, pick } from '@/shared/api/parse';

const normalizeReport = (raw: unknown): ReportData => {
  const obj = asRecord(raw, 'WeeklyReport');
  return {
    id: asOptionalString(pick(obj, ['reportId', 'id']), 'WeeklyReport.id'),
    menteeId: asString(pick(obj, ['menteeId', 'mentee_id']), 'WeeklyReport.menteeId'),
    startDate: asString(pick(obj, ['startDate', 'start_date']), 'WeeklyReport.startDate'),
    endDate: asString(pick(obj, ['endDate', 'end_date']), 'WeeklyReport.endDate'),
    totalReview: asString(pick(obj, ['overallFeedback', 'totalReview', 'total_review']), 'WeeklyReport.totalReview'),
    wellDone: asString(pick(obj, ['strengths', 'wellDone', 'well_done']), 'WeeklyReport.wellDone'),
    improvements: asString(
      pick(obj, ['weaknesses', 'improvements', 'improvement', 'need_improvement']),
      'WeeklyReport.improvements'
    ),
  };
};

const toRequestDto = (payload: ReportData) => {
  const date = payload.startDate ? parseISO(payload.startDate) : new Date();
  const reportYear = getYear(date);
  const reportMonth = getMonth(date) + 1;
  const weekNumber = getWeekOfMonth(date, { weekStartsOn: 0 });

  return {
    menteeId: payload.menteeId,
    reportYear,
    reportMonth,
    weekNumber,
    startDate: payload.startDate,
    endDate: payload.endDate,
    overallFeedback: payload.totalReview,
    strengths: payload.wellDone,
    weaknesses: payload.improvements,
  };
};

export const weeklyReportApi = {
  list: async (params: { year: number; month: number; menteeId?: string }): Promise<ReportData[]> => {
    if (USE_MOCK) return mockApi.report.list();
    const data = await apiClient.get('/weekly-reports', { params });
    const obj = asRecord(data, 'WeeklyReportPage');
    const list = Array.isArray(obj.content) ? obj.content : Array.isArray(data) ? data : [];
    return list.map(normalizeReport);
  },

  getById: async (reportId: string): Promise<ReportData> => {
    if (USE_MOCK) return mockApi.report.getById(reportId);
    const data = await apiClient.get(`/weekly-reports/${reportId}`);
    const obj = asRecord(data, 'WeeklyReportDetail');
    const report = obj.report ?? obj;
    return normalizeReport(report);
  },

  getByStartDate: async (startDate: string, menteeId?: string): Promise<ReportData | undefined> => {
    const [yearStr, monthStr] = startDate.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const list = await weeklyReportApi.list({ year, month, menteeId });
    return list.find((r) => r.startDate === startDate);
  },

  create: async (payload: ReportData): Promise<ReportData> => {
    if (USE_MOCK) return mockApi.report.create(payload);
    const data = await apiClient.post('/mentor/weekly-report', toRequestDto(payload));
    return normalizeReport(data);
  },

  update: async (reportId: string, payload: ReportData): Promise<ReportData> => {
    if (USE_MOCK) return mockApi.report.update(reportId, payload);
    const data = await apiClient.patch(`/mentor/weekly-report/${reportId}`, toRequestDto(payload));
    return normalizeReport(data);
  },

  remove: async (reportId: string): Promise<void> => {
    if (USE_MOCK) return mockApi.report.remove(reportId);
    await apiClient.delete(`/mentor/weekly-report/${reportId}`);
  },
};
