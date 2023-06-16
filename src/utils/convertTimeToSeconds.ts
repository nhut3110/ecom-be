import ms, { StringValue } from 'ms';

export function convertTimeToSeconds(time: StringValue): number {
  return Math.floor(ms(time) / 1000);
}
