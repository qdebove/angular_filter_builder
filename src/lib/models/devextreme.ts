import { FilterCondition, FilterExpression, FilterGroup, FilterNode, GroupOperator, isCondition, isGroup } from './filter-expression.js';

export type DevExtremeBinary = [string, string, unknown];
export type DevExtremeUnary = [string];
export type DevExtremeNot = ['!', DevExtremeExpression];
export type DevExtremeGroup = [DevExtremeExpression, 'and' | 'or', DevExtremeExpression];
export type DevExtremeExpression = DevExtremeBinary | DevExtremeUnary | DevExtremeNot | DevExtremeGroup;

export interface DevExtremePayload {
  filter?: DevExtremeExpression;
}

export function toDevExtreme<T>(group: FilterGroup<T>): DevExtremeExpression | undefined {
  if (group.children.length === 0) return undefined;
  const expressions: DevExtremeExpression[] = group.children
    .map((child) => {
      if (isGroup(child)) return toDevExtreme(child as FilterGroup<T>);
      return toBinary(child as FilterCondition<T>);
    })
    .filter((expr): expr is DevExtremeExpression => !!expr);

  if (expressions.length === 0) return undefined;
  return expressions.reduce((acc, expr) => (acc ? [acc, group.operator === 'and' ? 'and' : 'or', expr] : expr)) as DevExtremeExpression;
}

function toBinary<T>(condition: FilterCondition<T>): DevExtremeExpression {
  const { field, operator, value, valueTo } = condition;
  switch (operator) {
    case 'between':
      return [[field, '>=', value], 'and', [field, '<=', valueTo]] as DevExtremeGroup;
    case 'greaterThan':
      return [field, '>', value];
    case 'greaterThanOrEqual':
      return [field, '>=', value];
    case 'lessThan':
      return [field, '<', value];
    case 'lessThanOrEqual':
      return [field, '<=', value];
    case 'notEquals':
      return [field, '<>', value];
    case 'contains':
      return [field, 'contains', value];
    case 'startsWith':
      return [field, 'startswith', value];
    case 'endsWith':
      return [field, 'endswith', value];
    case 'before':
      return [field, '<', value];
    case 'after':
      return [field, '>', value];
    case 'isBlank':
      return [field, '=', null];
    case 'isNotBlank':
      return ['!', [field, '=', null]] as DevExtremeNot;
    default:
      return [field, '=', value];
  }
}

export function fromDevExtreme<T>(expression: DevExtremeExpression): FilterNode<T> {
  if (Array.isArray(expression) && expression[0] === '!') {
    const inner = fromDevExtreme<T>((expression as DevExtremeNot)[1]);
    return {
      id: crypto.randomUUID(),
      operator: 'not',
      children: [inner]
    } as FilterGroup<T>;
  }

  if (Array.isArray(expression) && expression.length === 3 && typeof expression[1] === 'string' && (expression[1] === 'and' || expression[1] === 'or')) {
    const [left, op, right] = expression as DevExtremeGroup;
    return {
      id: crypto.randomUUID(),
      operator: op as GroupOperator,
      children: [fromDevExtreme<T>(left), fromDevExtreme<T>(right)]
    };
  }

  const [field, op, value] = expression as DevExtremeBinary;
  const operatorMap: Record<string, string> = {
    '>': 'greaterThan',
    '>=': 'greaterThanOrEqual',
    '<': 'lessThan',
    '<=': 'lessThanOrEqual',
    '<>': 'notEquals',
    '=': 'equals',
    contains: 'contains',
    startswith: 'startsWith',
    endswith: 'endsWith'
  };

  return {
    id: crypto.randomUUID(),
    field: field as string,
    operator: (operatorMap[op] ?? 'equals') as any,
    value
  } as FilterCondition<T>;
}

export function normalizePayload<T>(expression: FilterExpression<T>): DevExtremePayload {
  const filter = toDevExtreme(expression.root);
  return filter ? { filter } : {};
}
