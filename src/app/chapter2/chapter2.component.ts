import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { arc, pie, scaleLinear, select } from 'd3';
import { DatasetList } from '../models/dataset-list';

@Component({
  selector: 'app-chapter2',
  templateUrl: './chapter2.component.html',
  styleUrls: ['./chapter2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Chapter2Component implements OnInit {

  @ViewChild('example1', { static: true }) example1Ref?: ElementRef<SVGAElement>;
  @ViewChild('example2', { static: true }) example2Ref?: ElementRef<SVGAElement>;
  @ViewChild('example3', { static: true }) example3Ref?: ElementRef<HTMLUListElement>;

  constructor() { }

  ngOnInit(): void {
    this.example1();
    this.example2();
    this.example3();
  }
  
  private example1(): void {
    if (this.example1Ref == null) return;
    
    const dataset1: [string, number][] = [['Mary', 1], ['Jane', 4], ['Anne', 2]];
    const dataset2: [string, number][] = [['Anne', 5], ['Jane', 3]];
    
    const scaleX = scaleLinear().domain([0, 6]).range([50, 300]);
    const scaleY = scaleLinear().domain([0, 3]).range([50, 150]);
    
    const svg = select(this.example1Ref.nativeElement);
    
    svg.selectAll('text')
      .data(dataset1)
      .enter()
      .append('text')
      .attr('x', 20)
      .attr('y', (d, i) => scaleY(i))
      .text(d => d[0]);
    
    svg.selectAll('circle')
      .data(dataset1, d => (d as [string, number])[0])
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', 'red')
      .attr('transform', 'translate(0, -5)')
      .attr('cx', d => scaleX(d[1]))
      .attr('cy', (d, i) => scaleY(i));

      svg.on('click', function(e: MouseEvent, d) {
        const selection = svg
          .selectAll<SVGCircleElement, [number, number, string]>('circle')
          .data(dataset2, d => d[0]);

      selection.transition()
        .duration(1000)
        .attr('cx', d => scaleX(d[1]));

      selection.exit().attr('fill', 'blue');
    });
  }
  
  private example2() {
    if (this.example2Ref == null) return;
    
    const datasetList = new DatasetList<[number, number, string][]>([
      [ [2, 3, 'green'], [1, 2, 'red'], [2, 1, 'blue'], [3, 2, 'yellow'] ],
      [ [1, 1, 'red'], [3, 3, 'black'], [1, 3, 'lime'],  [3, 1, 'blue'] ]
    ]);
    
    const svg = select(this.example2Ref.nativeElement);
    
    const scaleX = scaleLinear().domain([1, 3]).range([100, 200]);
    const scaleY = scaleLinear().domain([1, 3]).range([50, 100]);
    
    const draw = (): void => {
      const selection = svg
        .selectAll<SVGCircleElement, [number, number, string]>('circle')
        .data(datasetList.active, d => d[2]);
      
      selection.enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', d => d[2])
        .merge(selection)
        .attr('cx', d => scaleX(d[0]))
        .attr('cy', d => scaleY(d[1]));
      
      selection.exit().remove();
    };
    
    svg.on('click', function(e: MouseEvent, _d) {
      datasetList.next();
      draw();
    });
    
    draw();
  }
  
  private example3() {
    if (this.example3Ref == null) return;

    const dataset = ['Jane', 'Anne', 'Mary'];
    const ul = select<HTMLUListElement, string>(this.example3Ref.nativeElement);

    ul.selectAll<HTMLLIElement, string>('li')
      .data(dataset)
      .enter()
      .append('li')
      .text(d => d);

    ul.on('mouseenter', function(e: MouseEvent, _d) {
      ul.insert('li', ':nth-child(2)')
        .datum('Lucy')
        .text('Lucy');

      ul.insert('li', ':nth-child(1)')
        .datum('Lisa')
        .text('Lisa');

      ul.on('mouseenter', null);
    });

    ul.on('click', function(e: MouseEvent, _d) {
      ul.selectAll<HTMLLIElement, string>('li')
        .sort((a, b) => {
          if (a > b) return 1;
          if (a < b) return -1;
          return 0; 
        });

      ul.on('click', null);
    });
  }

}
