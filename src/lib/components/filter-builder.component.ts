import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterExpression, FilterGroup } from '../models/filter-expression.js';
import { FilterGroupComponent } from './filter-group.component.js';

@Component({
  selector: 'afb-filter-builder',
  standalone: true,
  imports: [CommonModule, FilterGroupComponent],
  templateUrl: './filter-builder.component.html',
  styleUrls: ['./filter-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBuilderComponent<T> {
  readonly expression = input.required<FilterExpression<T>>();
  readonly expressionChange = output<FilterExpression<T>>();

  reset() {
    const empty: FilterGroup<T> = { id: crypto.randomUUID(), operator: 'and', children: [] };
    this.expressionChange.emit({ ...this.expression(), root: empty });
  }

  onGroupChange(group: FilterGroup<T>) {
    this.expressionChange.emit({ ...this.expression(), root: group });
  }
}
