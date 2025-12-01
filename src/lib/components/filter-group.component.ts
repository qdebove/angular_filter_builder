import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterCondition, FilterFieldType, FilterGroup, FilterNode, isCondition, isGroup } from '../models/filter-expression.js';
import { FilterFieldDefinition, FilterFieldOption } from '../models/filter-field.js';
import { FilterConditionComponent } from './filter-condition.component.js';

@Component({
  selector: 'afb-filter-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilterConditionComponent],
  template: `
    <div class="border rounded p-3 mb-3">
      <div class="d-flex align-items-center gap-2 mb-2">
        <div class="btn-group">
          <button class="btn btn-sm" [class.btn-primary]="group.operator === 'and'" [class.btn-outline-primary]="group.operator !== 'and'" (click)="changeOperator('and')">AND</button>
          <button class="btn btn-sm" [class.btn-primary]="group.operator === 'or'" [class.btn-outline-primary]="group.operator !== 'or'" (click)="changeOperator('or')">OR</button>
          <button class="btn btn-sm" [class.btn-primary]="group.operator === 'not'" [class.btn-outline-primary]="group.operator !== 'not'" (click)="changeOperator('not')">NOT</button>
        </div>
        <div class="ms-auto">
          <button class="btn btn-sm btn-outline-secondary" (click)="addCondition()">+ Condition</button>
          <button class="btn btn-sm btn-outline-secondary" (click)="addGroup()">+ Group</button>
          <button *ngIf="canDelete" class="btn btn-sm btn-outline-danger" (click)="remove()">Supprimer</button>
        </div>
      </div>

      <div class="ms-2 border-start ps-3">
        <ng-container *ngFor="let child of group.children; let i = index">
          <div class="mb-3" *ngIf="isGroup(child)">
            <afb-filter-group
              [group]="child as FilterGroup<any>"
              [fields]="fields"
              [canDelete]="true"
              (groupChange)="updateChildGroup(i, $event)"
              (delete)="deleteChild(i)"
            ></afb-filter-group>
          </div>
          <div class="mb-2" *ngIf="isCondition(child)">
            <afb-filter-condition
              [condition]="child as FilterCondition<any>"
              [fields]="fields"
              (conditionChange)="updateCondition(i, $event)"
              (delete)="deleteChild(i)"
            ></afb-filter-condition>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterGroupComponent<T> {
  @Input({ required: true }) group!: FilterGroup<T>;
  @Input({ required: true }) fields!: FilterFieldDefinition<T>[];
  @Input() canDelete = false;
  @Output() groupChange = new EventEmitter<FilterGroup<T>>();
  @Output() delete = new EventEmitter<void>();

  isGroup = isGroup;
  isCondition = isCondition;

  changeOperator(operator: FilterGroup<T>['operator']) {
    this.groupChange.emit({ ...this.group, operator });
  }

  addCondition() {
    const field = this.fields[0];
    const condition: FilterCondition<T> = {
      id: crypto.randomUUID(),
      field: field.field,
      operator: 'equals',
      value: null
    } as FilterCondition<T>;
    this.groupChange.emit({ ...this.group, children: [...this.group.children, condition] });
  }

  addGroup() {
    const newGroup: FilterGroup<T> = { id: crypto.randomUUID(), operator: 'and', children: [] };
    this.groupChange.emit({ ...this.group, children: [...this.group.children, newGroup] });
  }

  updateChildGroup(index: number, child: FilterGroup<T>) {
    const updated = [...this.group.children];
    updated[index] = child;
    this.groupChange.emit({ ...this.group, children: updated });
  }

  updateCondition(index: number, condition: FilterCondition<T>) {
    const updated = [...this.group.children];
    updated[index] = condition;
    this.groupChange.emit({ ...this.group, children: updated });
  }

  deleteChild(index: number) {
    const updated = [...this.group.children];
    updated.splice(index, 1);
    this.groupChange.emit({ ...this.group, children: updated });
  }

  remove() {
    this.delete.emit();
  }
}
