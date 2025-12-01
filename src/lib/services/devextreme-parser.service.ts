import { FilterExpression, FilterGroup } from '../models/filter-expression.js';
import { FilterFieldDefinition } from '../models/filter-field.js';
import { DevExtremeExpression, fromDevExtreme, normalizePayload, toDevExtreme } from '../models/devextreme.js';

export class DevExtremeParserService<T> {
  constructor(private readonly fields: FilterFieldDefinition<T>[]) {}

  toDevExtreme(expression: FilterExpression<T>) {
    return normalizePayload(expression);
  }

  fromDevExtreme(expression: DevExtremeExpression): FilterExpression<T> {
    const root = fromDevExtreme<T>(expression) as FilterGroup<T>;
    return {
      root,
      fields: this.fields
    };
  }
}
