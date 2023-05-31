export function convertTimeToSeconds(time: string): number {
  const pureNumberPattern = /^\d+$/; // Match a string consisting of only digits
  if (pureNumberPattern.test(time)) {
    return parseInt(time);
  }

  const pattern = /^([0-9]+)(s|m|h|d)$/; // Match digits followed by 's', 'm', 'h', or 'd'
  const matches = pattern.exec(time);

  if (!matches) {
    throw new Error('Invalid time format');
  }

  const value = parseInt(matches[1]);
  const unit = matches[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      throw new Error('Invalid time unit');
  }
}
