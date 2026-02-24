/**
 * Formats an ISO date string (YYYY-MM-DD) to French format (DD/MM/YYYY)
 * @param isoDate - Date string in YYYY-MM-DD format
 * @returns Date string in DD/MM/YYYY format or the original string if invalid
 */
export function formatDateToFR(isoDate: string): string {
    if (!isoDate || !isoDate.includes('-')) return isoDate;

    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) return isoDate;

    return `${day}/${month}/${year}`;
}
