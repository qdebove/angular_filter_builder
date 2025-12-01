import { FilterExpression } from './filter-expression.js';

/**
 * Interface à implémenter pour sérialiser/désérialiser les expressions de filtre
 * vers le format cible de votre application (API, base de données, moteur distant...).
 */
export interface FilterSerializer<T, TExpression = unknown> {
  serialize(expression: FilterExpression<T>): TExpression;
  deserialize(payload: TExpression): FilterExpression<T>;
}
