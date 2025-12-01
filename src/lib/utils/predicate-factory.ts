import { FilterCondition, FilterExpression, FilterGroup, FilterNode, GroupOperator, isCondition, isGroup } from '../models/filter-expression.js';
import { FilterFieldDefinition, FilterFieldType } from '../models/filter-field.js';

export type Predicate<T> = (item: T) => boolean;

export function buildPredicate<T>(expression: FilterExpression<T>): Predicate<T> {
  const fieldMap = new Map(expression.fields.map((field) => [field.field, field]));

  const rootPredicate = resolveNode(expression.root, fieldMap);

  return (item: T) => rootPredicate(item);
}

function resolveNode<T>(node: FilterNode<T>, fieldMap: Map<string, FilterFieldDefinition<T>>): Predicate<T> {
  if (isGroup(node)) return resolveGroup(node, fieldMap);
  return resolveCondition(node as FilterCondition<T>, fieldMap);
}

function resolveGroup<T>(group: FilterGroup<T>, fieldMap: Map<string, FilterFieldDefinition<T>>): Predicate<T> {
  const childPredicates = group.children.map((child) => resolveNode(child, fieldMap));
  return (item: T) => {
    switch (group.operator) {
      case 'and':
        return childPredicates.every((predicate) => predicate(item));
      case 'or':
        return childPredicates.some((predicate) => predicate(item));
      case 'not':
        return !childPredicates.every((predicate) => predicate(item));
      default:
        return true;
    }
  };
}

function resolveCondition<T>(condition: FilterCondition<T>, fieldMap: Map<string, FilterFieldDefinition<T>>): Predicate<T> {
  const field = fieldMap.get(condition.field as string);
  if (!field) return () => false;

  return (item: T) => {
    const value = (item as any)[condition.field];
    if (value === undefined || value === null) {
      return condition.operator === 'isBlank';
    }
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'notEquals':
        return value !== condition.value;
      case 'contains':
        return typeof value === 'string' && typeof condition.value === 'string' && value.toLowerCase().includes(condition.value.toLowerCase());
      case 'startsWith':
        return typeof value === 'string' && typeof condition.value === 'string' && value.toLowerCase().startsWith(condition.value.toLowerCase());
      case 'endsWith':
        return typeof value === 'string' && typeof condition.value === 'string' && value.toLowerCase().endsWith(condition.value.toLowerCase());
      case 'greaterThan':
        return compare(value, condition.value) > 0;
      case 'greaterThanOrEqual':
        return compare(value, condition.value) >= 0;
      case 'lessThan':
        return compare(value, condition.value) < 0;
      case 'lessThanOrEqual':
        return compare(value, condition.value) <= 0;
      case 'between':
        return compare(value, condition.value) >= 0 && compare(value, condition.valueTo) <= 0;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'before':
        return compare(value, condition.value) < 0;
      case 'after':
        return compare(value, condition.value) > 0;
      case 'isBlank':
        return value === null || value === undefined || value === '';
      case 'isNotBlank':
        return !(value === null || value === undefined || value === '');
      default:
        return false;
    }
  };
}

function compare(a: unknown, b: unknown): number {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - (b as number);
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b as string);
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return 0;
}
