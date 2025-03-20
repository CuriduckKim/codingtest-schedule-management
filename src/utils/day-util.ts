import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Seoul");
/**
 * Format a date to a string using the specified format
 * @param date The date to format
 * @param format The format string (default: 'YYYY-MM-DD')
 * @returns The formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  format?: string
): string => {
  return dayjs(date).format(format);
};

/**
 * Get the current date and time in the Asia/Seoul timezone
 * @returns A dayjs object representing the current date and time
 */
export const getNow = (): dayjs.Dayjs => {
  return dayjs().tz("Asia/Seoul");
};

/**
 * Add a specified amount of time to a date
 * @param date The starting date
 * @param amount The amount to add
 * @param unit The unit of time ('day', 'month', 'year', etc.)
 * @returns A dayjs object with the added time
 */
export const addTime = (
  date: Date | string | number,
  amount: number,
  unit: dayjs.ManipulateType
): dayjs.Dayjs => {
  return dayjs(date).add(amount, unit);
};

/**
 * Check if a date is before another date
 * @param date The date to check
 * @param compareDate The date to compare against
 * @returns True if the date is before the compare date
 */
export const isBefore = (
  date: Date | string | number,
  compareDate: Date | string | number
): boolean => {
  return dayjs(date).isBefore(dayjs(compareDate));
};

/**
 * Check if a date is after another date
 * @param date The date to check
 * @param compareDate The date to compare against
 * @returns True if the date is after the compare date
 */
export const isAfter = (
  date: Date | string | number,
  compareDate: Date | string | number
): boolean => {
  return dayjs(date).isAfter(dayjs(compareDate));
};
