export enum FilterFieldType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  Enum = 'enum'
}

export interface FilterFieldOption<T> {
  value: T;
  label?: string;
}

export interface FilterFieldDefinition<TValue = unknown> {
  /** Property name in the bound type */
  field: keyof TValue & string;
  /** Human readable label */
  label?: string;
  /** Type of the field */
  type: FilterFieldType;
  /** Optional enum options for dropdowns */
  options?: FilterFieldOption<TValue[keyof TValue]>[];
  /** Optional operators to override defaults for the type */
  operators?: string[];
  /** Allow null or empty values */
  nullable?: boolean;
}
