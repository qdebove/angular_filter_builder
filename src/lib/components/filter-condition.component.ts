import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { defaultOperatorMap, FieldOperator, FilterCondition } from '../models/filter-expression.js';
import { FilterFieldDefinition, FilterFieldType } from '../models/filter-field.js';
import { OperatorSelectComponent } from './operator-select.component.js';

@Component({
  selector: 'afb-filter-condition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OperatorSelectComponent],
  template: `
    <form [formGroup]="form" class="row g-2 align-items-end border rounded p-2">
      <div class="col-md-4">
        <label class="form-label small text-muted">Champ</label>
        <select class="form-select form-select-sm" formControlName="field">
          <option *ngFor="let field of fields" [value]="field.field">{{ field.label || field.field }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label small text-muted">Opérateur</label>
        <afb-operator-select
          [fieldType]="currentField?.type || 'string'"
          formControlName="operator"
        ></afb-operator-select>
      </div>
      <div class="col-md-4" *ngIf="displayValueInput">
        <label class="form-label small text-muted">Valeur</label>
        <input
          *ngIf="currentField?.type !== 'enum' && currentField?.type !== 'boolean'"
          class="form-control form-control-sm"
          [type]="inputType"
          formControlName="value"
        />
        <select *ngIf="currentField?.type === 'enum'" class="form-select form-select-sm" formControlName="value">
          <option *ngFor="let opt of currentField?.options" [value]="opt.value">{{ opt.label || opt.value }}</option>
        </select>
        <select *ngIf="currentField?.type === 'boolean'" class="form-select form-select-sm" formControlName="value">
          <option [ngValue]="true">True</option>
          <option [ngValue]="false">False</option>
        </select>
      </div>
      <div class="col-md-4" *ngIf="form.value.operator === 'between'">
        <label class="form-label small text-muted">Et</label>
        <input class="form-control form-control-sm" [type]="inputType" formControlName="valueTo" />
      </div>
      <div class="col-md-1 d-grid">
        <button type="button" class="btn btn-outline-danger btn-sm" (click)="remove()">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterConditionComponent<T> {
  @Input({ required: true }) condition!: FilterCondition<T>;
  @Input({ required: true }) fields!: FilterFieldDefinition<T>[];
  @Output() conditionChange = new EventEmitter<FilterCondition<T>>();
  @Output() delete = new EventEmitter<void>();

  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      field: [''],
      operator: ['equals'],
      value: [null],
      valueTo: [null]
    });

    this.form.valueChanges.subscribe((value) => {
      const updated: FilterCondition<T> = { ...this.condition, ...value } as FilterCondition<T>;
      this.conditionChange.emit(updated);
    });
  }

  ngOnInit() {
    this.form.patchValue(this.condition, { emitEvent: false });
  }

  get currentField(): FilterFieldDefinition<T> | undefined {
    return this.fields.find((f) => f.field === this.form.value.field) ?? this.fields[0];
  }

  get inputType(): string {
    switch (this.currentField?.type) {
      case FilterFieldType.Number:
        return 'number';
      case FilterFieldType.Date:
        return 'date';
      case FilterFieldType.Boolean:
        return 'checkbox';
      default:
        return 'text';
    }
  }

  get displayValueInput(): boolean {
    return !['isBlank', 'isNotBlank'].includes(this.form.value.operator);
  }

  remove() {
    this.delete.emit();
  }
}
