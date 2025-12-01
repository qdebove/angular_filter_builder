import { FilterExpression, FilterGroup } from '../models/filter-expression.js';
import { FilterFieldDefinition } from '../models/filter-field.js';

export class FilterBuilderService<T> {
  constructor(private readonly fields: FilterFieldDefinition<T>[]) {}

  createEmpty(): FilterExpression<T> {
    return {
      fields: this.fields,
      root: this.createGroup('and')
    };
  }

  createGroup(operator: 'and' | 'or' | 'not'): FilterGroup<T> {
    return {
      id: crypto.randomUUID(),
      operator,
      children: []
    };
  }
}
