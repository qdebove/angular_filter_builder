import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBuilderComponent } from '../components/filter-builder.component.js';
import { FilterFieldDefinition, FilterFieldType } from '../models/filter-field.js';
import { FilterExpression } from '../models/filter-expression.js';
import { FilterApplyService } from '../services/filter-apply.service.js';
import { FilterBuilderService } from '../services/filter-builder.service.js';

interface DemoAccount {
  id: number;
  company: string;
  country: string;
  active: boolean;
  contacts: number;
  joined: string;
  segment: 'startup' | 'smb' | 'enterprise';
}

@Component({
  selector: 'afb-visual-demo',
  standalone: true,
  imports: [CommonModule, FilterBuilderComponent],
  templateUrl: './visual-demo.component.html',
  styleUrls: ['./visual-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualDemoComponent {
  readonly fields: FilterFieldDefinition<DemoAccount>[] = [
    { field: 'company', label: 'Société', type: FilterFieldType.String },
    { field: 'country', label: 'Pays', type: FilterFieldType.String },
    { field: 'active', label: 'Actif', type: FilterFieldType.Boolean },
    { field: 'contacts', label: 'Contacts', type: FilterFieldType.Number },
    { field: 'joined', label: 'Arrivé le', type: FilterFieldType.Date },
    {
      field: 'segment',
      label: 'Segment',
      type: FilterFieldType.Enum,
      options: [
        { value: 'startup', label: 'Startup' },
        { value: 'smb', label: 'SMB' },
        { value: 'enterprise', label: 'Enterprise' }
      ]
    }
  ];

  readonly dataset: DemoAccount[] = [
    {
      id: 1,
      company: 'Blue Nova',
      country: 'France',
      active: true,
      contacts: 12,
      joined: '2023-11-02',
      segment: 'startup'
    },
    {
      id: 2,
      company: 'Helios Labs',
      country: 'Canada',
      active: false,
      contacts: 4,
      joined: '2022-05-14',
      segment: 'smb'
    },
    {
      id: 3,
      company: 'Orca Systems',
      country: 'USA',
      active: true,
      contacts: 28,
      joined: '2021-01-22',
      segment: 'enterprise'
    },
    {
      id: 4,
      company: 'Tamaris',
      country: 'France',
      active: true,
      contacts: 6,
      joined: '2024-02-08',
      segment: 'smb'
    },
    {
      id: 5,
      company: 'Nadir Works',
      country: 'Spain',
      active: false,
      contacts: 18,
      joined: '2020-07-30',
      segment: 'enterprise'
    },
    {
      id: 6,
      company: 'Minty',
      country: 'Germany',
      active: true,
      contacts: 9,
      joined: '2023-06-11',
      segment: 'startup'
    }
  ];

  readonly expression: FilterExpression<DemoAccount>;
  filtered: DemoAccount[];

  private readonly builder = new FilterBuilderService<DemoAccount>(this.fields);
  private readonly apply = new FilterApplyService();

  constructor() {
    this.expression = this.builder.createEmpty();
    this.filtered = this.apply.applyFilter(this.dataset, this.expression);
  }

  onExpressionChange(expression: FilterExpression<DemoAccount>) {
    this.expression = expression;
    this.filtered = this.apply.applyFilter(this.dataset, expression);
  }
}
