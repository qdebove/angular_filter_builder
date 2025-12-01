import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { defaultOperatorMap, FieldOperator } from '../models/filter-expression.js';
import { FilterFieldType } from '../models/filter-field.js';

@Component({
  selector: 'afb-operator-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: OperatorSelectComponent,
      multi: true
    }
  ],
  templateUrl: './operator-select.component.html',
  styleUrls: ['./operator-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorSelectComponent implements ControlValueAccessor {
  readonly fieldType = input<FilterFieldType>(FilterFieldType.String);
  value: FieldOperator = 'equals';

  private onChange: (value: FieldOperator) => void = () => {};
  private onTouched: () => void = () => {};

  get operators(): FieldOperator[] {
    return defaultOperatorMap[this.fieldType()] ?? defaultOperatorMap[FilterFieldType.String];
  }

  onChangeValue(value: FieldOperator) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(obj: FieldOperator): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
