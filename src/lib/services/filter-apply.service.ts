import { FilterExpression } from '../models/filter-expression.js';
import { buildPredicate } from '../utils/predicate-factory.js';

export class FilterApplyService {
  applyFilter<T>(data: T[], expression: FilterExpression<T>): T[] {
    const predicate = buildPredicate(expression);
    return data.filter(predicate);
  }
}
