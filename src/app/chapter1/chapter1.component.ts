import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, scaleLinear, line, max, curveStep, curveNatural, CurveFactory, axisBottom, axisLeft, extent, shuffle } from 'd3';
import { forkJoin } from 'rxjs';
import { MarginConvention } from '../models/margin-convention';
import { DatasetService } from '../services/dataset.service';
import { IExampleMultiple, IExampleSimple } from '../services/dataset.types';

@Component({
  selector: 'app-chapter1',
  templateUrl: './chapter1.component.html',
  styleUrls: ['./chapter1.component.scss']
})
export class Chapter1Component implements OnInit {

  @ViewChild('svg1', { static: true }) svg1?: ElementRef<SVGAElement>;
  @ViewChild('svg2', { static: true }) svg2?: ElementRef<SVGAElement>;
  @ViewChild('svg3', { static: true }) svg3?: ElementRef<SVGAElement>;

  @ViewChild('ul', { static: true }) ul?: ElementRef<HTMLUListElement>;
  @ViewChild('ul2', { static: true }) ul2?: ElementRef<HTMLUListElement>;

  constructor(private datasetService: DatasetService) { }

  ngOnInit(): void {
    const datasets$ = forkJoin([
      this.datasetService.getExamplesSimple(),
      this.datasetService.getExamplesMultiple()
    ]);

    datasets$.subscribe(([simpleDataset, multipleDataset]) => {
      this.drawExamplesSimple(simpleDataset);
      this.drawExamplesMultiple(multipleDataset);
      this.drawExamplesMultipleAdvinced(multipleDataset);
      this.drawList();
      this.drawList2();
    });
  }

  private drawExamplesSimple(data: readonly IExampleSimple[]): void {
    if (this.svg1 == null) return;

    select(this.svg1.nativeElement)
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 5).attr("fill", "red")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  private drawExamplesMultiple(data: readonly IExampleMultiple[]): void {
    if (this.svg2 == null) return;

    const width = 1000;
    const height = 500;

    const svg = select(this.svg2.nativeElement);

    const scaleX = scaleLinear()
      .domain([0, max(data, d => d.x) as number])
      .range([10, width - 10]);

    const draw = <T>(
      data: readonly T[],
      color: string,
      accessorX: (item: T) => number,
      accessorY: (item: T) => number
    ): void => {
      const g = svg.append('g');

      const scaleY = scaleLinear()
        .domain([0, max(data, accessorY) as number])
        .range([height - 10, 10]);

      const lineMaker = line<T>()
        .x(d => scaleX(accessorX(d)))
        .y(d => scaleY(accessorY(d)));

      g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', color)
        .attr('cx', d => scaleX(accessorX(d)))
        .attr('cy', d => scaleY(accessorY(d)));

      g.append('path')
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('d', lineMaker(data));
    };

    draw(data, 'blue',  d => d.x, d => d.y1);
    draw(data, 'brown', d => d.x, d => d.y2);
  }

  private drawExamplesMultipleAdvinced(data: readonly IExampleMultiple[]): void {
    if (this.svg3 == null) return;

    const MC = new MarginConvention(1000, 500, {top: 30, bottom: 30, left: 30, right: 30});

    const svg = select(this.svg3.nativeElement)
      .append('g')
      .attr('width', MC.innerWidth)
      .attr('height', MC.innerHeight)
      .attr('transform', `translate(${MC.margin.left}, ${MC.margin.top})`);

    const scaleX = scaleLinear()
      .domain(extent(data, d => d.x) as [number, number])
      .range([0, MC.innerWidth])
      .nice();

    const draw = <T>(
      data: readonly T[],
      color: string,
      curve: CurveFactory,
      accessorX: (item: T) => number,
      accessorY: (item: T) => number
    ): void => {
      const g = svg.append('g');

      const scaleY = scaleLinear()
        .domain(extent(data, accessorY) as [number, number])
        .range([MC.innerHeight, 0]);

      const lineMaker = line<T>()
        .curve(curve)
        .x(d => scaleX(accessorX(d)))
        .y(d => scaleY(accessorY(d)));

      g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', color)
        .attr('cx', d => scaleX(accessorX(d)))
        .attr('cy', d => scaleY(accessorY(d)));

      g.append('path')
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 3)
        .attr('d', lineMaker(data));
    }

    svg.append('g')
      .attr('transform', `translate(0, ${MC.innerHeight})`)
      .call(axisBottom(scaleX));
      
    svg.append('g')
      .attr('transform', 'translate(0, 0)')
      .call(axisLeft(scaleLinear().range([MC.innerHeight, 0])));

    draw(data, 'blue', curveStep, d => d.x, d => d.y1);
    draw(data, 'red', curveNatural, d => d.x, d => d.y2);
  }

  private drawList(): void {
    if (this.ul == null) return;
    
    const list = [
      {text: "From East", active: true},
      {text: "to West", active: false},
      {text: "at Home", active: true},
      {text: "is Best", active: false}
    ];

    const color = {
      default: 'black',
      active: 'red'
    };

    select(this.ul.nativeElement)
      .selectAll('li')
      .data(list)
      .enter()
      .append('li')
      .style('color', d => d.active ? color.active : color.default)
      .text(d => d.text)
      .on('click', function(e: MouseEvent, d) {
        d.active = !d.active;
        select(e.target as HTMLElement)
          .transition()
          .duration(500)
          .style('color', d.active ? color.active : color.default);
      });
  }

  private drawList2(): void {
    if (this.ul2 == null) return;

    const dataset = ['1', '2', '3', '4', '5'];

    const ul = select(this.ul2.nativeElement);
    
    const liSelection = ul.selectAll<HTMLLIElement, string>('li')
      .data(dataset, d => d);

    liSelection.enter()
      .append('li')
      .style('color', 'tomato')
      .text(d => d);
    

    ul.on('click', function () {
      ul.selectAll<HTMLLIElement, string>('li')
        .data(['9', '1', '2', '4', '8', '11'], d => d)
        .join('li')
        .style('color', 'blue')
        .text(d => d);
    })
  }

}
