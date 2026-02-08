type ReportData = {
    id: string;
    startDate: string;
    menteeId: string;
};

const MOCK_REPORT_DB: ReportData[] = [];

export const getWeeklyReportById = (reportId: string): ReportData | undefined => {
    return MOCK_REPORT_DB.find((report: ReportData) => report.id === reportId);
};

export const getWeeklyReportByStartDate = (
    startDate: string,
    menteeId: string
): ReportData | undefined => {
    return MOCK_REPORT_DB.find(
        (report: ReportData) => report.startDate === startDate && report.menteeId === menteeId
    );
};
