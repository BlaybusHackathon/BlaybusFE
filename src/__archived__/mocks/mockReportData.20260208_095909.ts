import { MOCK_REPORT_DB, ReportData } from '@/widgets/mentor-report/model/mockReportData';

export const getWeeklyReportById = (reportId: string): ReportData | undefined => {
    return MOCK_REPORT_DB.find((report) => report.id === reportId);
};

export const getWeeklyReportByStartDate = (
    startDate: string, 
    menteeId: string
): ReportData | undefined => {
    return MOCK_REPORT_DB.find(
        (report) => report.startDate === startDate && report.menteeId === menteeId
    );
};