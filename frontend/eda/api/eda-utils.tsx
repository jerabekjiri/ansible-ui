import { apiTag } from '../../hub/api/utils';

export function edaAPI(strings: TemplateStringsArray, ...values: string[]) {
  const base = process.env.EDA_API_PREFIX;
  return base + apiTag(strings, ...values);
}
