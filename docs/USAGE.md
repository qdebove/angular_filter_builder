# Guide d'utilisation rapide

## Définir vos champs typés
```ts
import { FilterBuilderService, FilterFieldDefinition, FilterFieldType } from 'angular-filter-builder';

type Customer = { id: number; name: string; createdOn: Date; isActive: boolean; region: 'EMEA' | 'NA' | 'APAC' };

const fields: FilterFieldDefinition<Customer>[] = [
  { field: 'id', label: 'Identifiant', type: FilterFieldType.Number },
  { field: 'name', label: 'Nom', type: FilterFieldType.String },
  { field: 'createdOn', label: 'Créé le', type: FilterFieldType.Date },
  { field: 'isActive', label: 'Actif ?', type: FilterFieldType.Boolean },
  { field: 'region', label: 'Région', type: FilterFieldType.Enum, options: [
    { value: 'EMEA', label: 'EMEA' },
    { value: 'NA', label: 'Amériques' },
    { value: 'APAC', label: 'APAC' }
  ] }
];

const builder = new FilterBuilderService<Customer>(fields);
const expression = builder.createEmpty();
```

## Utilisation dans un composant Angular
```ts
import { Component, signal } from '@angular/core';
import { FilterBuilderComponent, FilterApplyService, DevExtremeParserService, FilterExpression } from 'angular-filter-builder';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [FilterBuilderComponent],
  template: `
    <afb-filter-builder
      [expression]="expression()"
      (expressionChange)="update($event)"
    ></afb-filter-builder>

    <pre class="bg-light p-3 mt-3">{{ devExtremeJson }}</pre>
  `
})
export class AppComponent {
  private readonly applyService = new FilterApplyService();
  private readonly parser = new DevExtremeParserService<Customer>(fields);

  expression = signal<FilterExpression<Customer>>(builder.createEmpty());
  devExtremeJson = '';

  update(expression: FilterExpression<Customer>) {
    this.expression.set(expression);
    const payload = this.parser.toDevExtreme(expression);
    this.devExtremeJson = JSON.stringify(payload, null, 2);
  }
}
```

## Appliquer le filtre
```ts
const customers: Customer[] = fetchCustomers();
const filtered = new FilterApplyService().applyFilter(customers, expression);
```

## Aller/retour avec DevExtreme
```ts
const devExtremeExpression = [ ['name', 'contains', 'Ann'], 'and', ['isActive', '=', true] ] as const;
const parsed = parser.fromDevExtreme(devExtremeExpression);
```

## Styles
Les templates utilisent les classes Bootstrap 5 et `bi` (Bootstrap Icons). Chargez-les dans votre application hôte si nécessaire.
