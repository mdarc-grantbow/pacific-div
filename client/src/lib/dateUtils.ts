export function formatDateInTimezone(date: Date | string, timezone: string = 'America/Los_Angeles'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { timeZone: timezone });
}

export function formatDateRangeInTimezone(
  startDate: Date | string,
  endDate: Date | string,
  timezone: string = 'America/Los_Angeles'
): string {
  return `${formatDateInTimezone(startDate, timezone)} - ${formatDateInTimezone(endDate, timezone)}`;
}
