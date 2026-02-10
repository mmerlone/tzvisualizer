
import { TimezoneCollection, TimezoneInfo } from '../types';

/**
 * Fetches timezone GeoJSON data. 
 * Note: Real evansiroky/timezone-boundary-builder files are huge (>100MB), 
 * so we use a simplified Natural Earth version for the browser UI demo.
 */
export const fetchTimezoneData = async (url: string): Promise<TimezoneCollection> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch timezone data');
  return response.json();
};

/**
 * Calculates current UTC offset for a given timezone ID.
 */
export const getTimezoneOffset = (tzid: string): number => {
  try {
    const date = new Date();
    const localizedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: tzid,
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(date);
    
    // Fallback logic if Intl isn't perfectly supported or TZID is missing
    const parts = localizedDate.split(',');
    // Simplified offset calculation (this is for visual grouping)
    // For robust production apps, one would use a library like 'luxon' or 'date-fns-tz'
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tzid,
      timeZoneName: 'shortOffset'
    });
    const partsName = formatter.formatToParts(date);
    const offsetPart = partsName.find(p => p.type === 'timeZoneName')?.value || '';
    
    // Parse GMT+3, GMT-3, etc.
    const match = offsetPart.match(/[+-]\d+/);
    return match ? parseInt(match[0], 10) : 0;
  } catch (e) {
    return 0;
  }
};

export const formatOffset = (offset: number): string => {
  const sign = offset >= 0 ? '+' : '';
  return `GMT${sign}${offset}`;
};
