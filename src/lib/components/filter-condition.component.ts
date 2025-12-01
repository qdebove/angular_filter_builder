import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterCondition } from '../models/filter-expression.js';
import { FilterFieldDefinition, FilterFieldType } from '../models/filter-field.js';
import { OperatorSelectComponent } from './operator-select.component.js';

@Component({
  selector: 'afb-filter-condition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OperatorSelectComponent],
  templateUrl: './filter-condition.component.html',
  styleUrls: ['./filter-condition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterConditionComponent<T> implements OnInit {
  readonly condition = input.required<FilterCondition<T>>();
  readonly fields = input.required<FilterFieldDefinition<T>[]>();
  readonly conditionChange = output<FilterCondition<T>>();
  readonly delete = output<void>();

  readonly form: FormGroup;
  private readonly fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      field: [''],
      operator: ['equals'],
      value: [null],
      valueTo: [null]
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const updated: FilterCondition<T> = { ...this.condition(), ...value } as FilterCondition<T>;
      this.conditionChange.emit(updated);
    });
  }

  ngOnInit() {
    this.form.patchValue(this.condition(), { emitEvent: false });
  }

  get currentField(): FilterFieldDefinition<T> | undefined {
    return this.fields().find((f) => f.field === this.form.value.field) ?? this.fields()[0];
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
