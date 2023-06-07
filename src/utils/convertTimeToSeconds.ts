import ms from 'ms';

export function convertTimeToSeconds(time: string): number {
  return Math.floor(ms(time.toString()) / 1000);
}
