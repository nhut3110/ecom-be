import { SortValues } from 'src/constants';

const sortFunctions: Record<string, string[]> = {
  [SortValues.PRICE_ASC]: ['price', 'ASC'],
  [SortValues.PRICE_DESC]: ['price', 'DESC'],
  [SortValues.AZ]: ['title', 'ASC'],
  [SortValues.ZA]: ['title', 'DESC'],
  [SortValues.RATE_ASC]: ['rate', 'ASC'],
  [SortValues.RATE_DESC]: ['rate', 'DESC'],
};

export { sortFunctions };
