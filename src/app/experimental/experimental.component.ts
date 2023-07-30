import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IDataKeyAccessor, IDataValueAccessor } from '../animated-pie/animated-pie.types';
import { IDatasetType } from './experimental.types';

@Component({
  selector: 'app-experimental',
  templateUrl: './experimental.component.html',
  styleUrls: ['./experimental.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperimentalComponent implements OnInit {

  data: IDatasetType[];

  readonly dataset1: IDatasetType[];
  readonly dataset2: IDatasetType[];

  readonly datasetKeyAccessor: IDataKeyAccessor<IDatasetType> = d => d.series;
  readonly datasetValueAccessor: IDataValueAccessor<IDatasetType> = d => d.value;

  constructor(private cd: ChangeDetectorRef) {
    this.dataset1 = [{series: 1, value: 1}, {series: 2, value: 2}, {series: 3, value: 3}, {series: 4, value: 4}, {series: 5, value: 5}];
    this.dataset2 = [{series: 1, value: 5}, {series: 3, value: 4}, {series: 6, value: 3}];
    //this.dataset2 = [{series: 1, value: 2}, {series: 2, value: 3}, {series: 3, value: 4}, {series: 4, value: 8}, {series: 5, value: 6}];

    this.data = this.dataset1;
  }

  ngOnInit(): void {
    
  }

  toggleDataset(circleRef: SVGCircleElement): void {
    if (this.data === this.dataset1) this.data = this.dataset2;
    else this.data = this.dataset1;
  }

}
