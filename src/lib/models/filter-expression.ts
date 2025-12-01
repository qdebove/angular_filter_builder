import { FilterFieldDefinition, FilterFieldType } from './filter-field.js';

export type GroupOperator = 'and' | 'or' | 'not';

export type FieldOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'in'
  | 'isBlank'
  | 'isNotBlank'
  | 'before'
  | 'after';

export interface FilterCondition<TValue = unknown> {
  id: string;
  field: FilterFieldDefinition<TValue>['field'];
  operator: FieldOperator;
  value?: unknown;
  valueTo?: unknown;
}

export interface FilterGroup<TValue = unknown> {
  id: string;
  operator: GroupOperator;
  children: FilterNode<TValue>[];
}

export type FilterNode<TValue = unknown> = FilterGroup<TValue> | FilterCondition<TValue>;

export function isGroup<TValue>(node: FilterNode<TValue>): node is FilterGroup<TValue> {
  return (node as FilterGroup<TValue>).children !== undefined;
}

export function isCondition<TValue>(node: FilterNode<TValue>): node is FilterCondition<TValue> {
  return (node as FilterCondition<TValue>).operator !== undefined && (node as FilterCondition<TValue>).field !== undefined;
}

export interface FilterExpression<TValue = unknown> {
  root: FilterGroup<TValue>;
  fields: FilterFieldDefinition<TValue>[];
}

export const defaultOperatorMap: Record<FilterFieldType, FieldOperator[]> = {
  [FilterFieldType.String]: ['contains', 'startsWith', 'endsWith', 'equals', 'notEquals', 'isBlank', 'isNotBlank'],
  [FilterFieldType.Number]: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'isBlank', 'isNotBlank'],
  [FilterFieldType.Boolean]: ['equals', 'notEquals', 'isBlank', 'isNotBlank'],
  [FilterFieldType.Date]: ['before', 'after', 'between', 'equals', 'notEquals', 'isBlank', 'isNotBlank'],
  [FilterFieldType.Enum]: ['equals', 'notEquals', 'in', 'isBlank', 'isNotBlank']
};
