import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterExpression, FilterGroup } from '../models/filter-expression.js';
import { FilterFieldDefinition } from '../models/filter-field.js';
import { FilterGroupComponent } from './filter-group.component.js';

@Component({
  selector: 'afb-filter-builder',
  standalone: true,
  imports: [CommonModule, FilterGroupComponent],
  template: `
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white d-flex align-items-center justify-content-between">
        <span class="fw-semibold">Filter Builder</span>
        <button class="btn btn-sm btn-light" (click)="reset()">Reset</button>
      </div>
      <div class="card-body">
        <afb-filter-group
          [group]="expression.root"
          [fields]="expression.fields"
          (groupChange)="onGroupChange($event)"
        ></afb-filter-group>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBuilderComponent<T> {
  @Input({ required: true }) expression!: FilterExpression<T>;
  @Output() expressionChange = new EventEmitter<FilterExpression<T>>();

  reset() {
    const empty: FilterGroup<T> = { id: crypto.randomUUID(), operator: 'and', children: [] };
    this.expressionChange.emit({ ...this.expression, root: empty });
  }

  onGroupChange(group: FilterGroup<T>) {
    this.expressionChange.emit({ ...this.expression, root: group });
  }
}
