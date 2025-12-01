import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterCondition, FilterGroup, isCondition, isGroup } from '../models/filter-expression.js';
import { FilterFieldDefinition } from '../models/filter-field.js';
import { FilterConditionComponent } from './filter-condition.component.js';

@Component({
  selector: 'afb-filter-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilterConditionComponent],
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterGroupComponent<T> {
  readonly group = input.required<FilterGroup<T>>();
  readonly fields = input.required<FilterFieldDefinition<T>[]>();
  readonly canDelete = input(false);
  readonly groupChange = output<FilterGroup<T>>();
  readonly delete = output<void>();

  readonly isGroup = isGroup;
  readonly isCondition = isCondition;

  changeOperator(operator: FilterGroup<T>['operator']) {
    const group = this.group();
    this.groupChange.emit({ ...group, operator });
  }

  addCondition() {
    const field = this.fields()[0];
    const condition: FilterCondition<T> = {
      id: crypto.randomUUID(),
      field: field.field,
      operator: 'equals',
      value: null
    } as FilterCondition<T>;
    const children = [...this.group().children, condition];
    this.groupChange.emit({ ...this.group(), children });
  }

  addGroup() {
    const newGroup: FilterGroup<T> = { id: crypto.randomUUID(), operator: 'and', children: [] };
    const children = [...this.group().children, newGroup];
    this.groupChange.emit({ ...this.group(), children });
  }

  updateChildGroup(index: number, child: FilterGroup<T>) {
    const updated = [...this.group().children];
    updated[index] = child;
    this.groupChange.emit({ ...this.group(), children: updated });
  }

  updateCondition(index: number, condition: FilterCondition<T>) {
    const updated = [...this.group().children];
    updated[index] = condition;
    this.groupChange.emit({ ...this.group(), children: updated });
  }

  deleteChild(index: number) {
    const updated = [...this.group().children];
    updated.splice(index, 1);
    this.groupChange.emit({ ...this.group(), children: updated });
  }

  remove() {
    this.delete.emit();
  }
}
