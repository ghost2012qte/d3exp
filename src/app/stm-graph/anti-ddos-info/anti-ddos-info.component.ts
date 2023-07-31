import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ANTI_DDOS_MC, COLORS } from './anti-ddos-info.config';
import { ScaleLinear, ScaleTime, Selection, area, line, range, scaleBand, scaleLinear, scaleOrdinal, scaleTime, select } from 'd3';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-anti-ddos-info',
  templateUrl: './anti-ddos-info.component.html',
  styleUrls: ['./anti-ddos-info.component.scss']
})
export class AntiDdosInfoComponent implements OnInit {
  readonly mc = ANTI_DDOS_MC;

  @ViewChild('svgRef', { static: true }) svgRef!: ElementRef<SVGElement>;

  private svg!: Selection<SVGElement, unknown, null, undefined>;
  private scaleX!: ScaleTime<number, number, never>;
  private scaleY!:  ScaleLinear<number, number, never>;

  private dataset: ReturnType<AntiDdosInfoComponent['generateData']>;
  private dates: Date[];

  constructor(private readonly datePipe: DatePipe) {
    this.dataset = this.generateData();

    this.dates = this.dataset
      .filter(d => d.date.getSeconds() === 0)
      .map(d => d.date);
  }

  ngOnInit(): void {
    this.draw();
  }

  private draw(): void {
    this.svg = select(this.svgRef.nativeElement);

    this.scaleX = scaleTime()
      .domain([this.dates[0], this.dates[this.dates.length - 1]])
      .range([0, this.mc.innerWidth]);

    this.scaleY = scaleLinear()
      .domain([0, 100000]) // TODO
      .range([this.mc.innerHeight, 0]);
    
    this.drawAreaChart();
    this.drawAxis();
    this.addInteractivity();
  }

  private drawAxis(): void {
    // drawing X
    const gX = this.createG();

    const datesSliced = this.dates.slice(1, this.dates.length - 1);

    gX.append('line')
      .attr('class', 'scaleX')
      .attr('x1', 0)
      .attr('y1', this.mc.innerHeight)
      .attr('x2', this.mc.innerWidth)
      .attr('y2', this.mc.innerHeight)
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    gX.selectAll('text')
      .data(datesSliced)
      .enter()
      .append('text')
      .attr('y', this.mc.innerHeight + 25)
      .attr('x', d => this.scaleX(d))
      .attr('font-size', '20')
      .attr('text-anchor', 'middle')
      .text(d => this.datePipe.transform(d, 'HH:mm:ss'));

    gX.selectAll('line.splitter')
      .data(datesSliced)
      .enter()
      .append('line')
      .attr('class', 'splitter')
      .attr('y1', this.mc.innerHeight + 4)
      .attr('y2', this.mc.innerHeight)
      .attr('x1', d => this.scaleX(d))
      .attr('x2', d => this.scaleX(d))
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    // drawing Y
    const gY = this.createG();

    gY.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', this.mc.innerHeight)
    .attr('stroke', '#000')
    .attr('stroke-width', 1);

    gY.selectAll('text')
      .data([0, 50000, 100000]) // TODO
      .enter()
      .append('text')
      .attr('text-anchor', 'end')
      .attr("dominant-baseline", "central")
      .attr('font-size', '20')
      .attr('x', -10)
      .attr('y', d => this.scaleY(d))
      .text(d => d < 1000 ? d : d / 1000 + 'k');
  }

  private drawAreaChart(): void {
    const g = this.createG();

    const colorDomain = range(this.dataset[0].values.length).map(d => d.toString());

    const scaleFill = scaleOrdinal<string>()
      .domain(colorDomain)
      .range(COLORS.map(c => c.fill));
    
    const scaleStroke = scaleOrdinal<string>()
      .domain(colorDomain)
      .range(COLORS.map(c => c.stroke));

    for (let i = 0; i < colorDomain.length; i++) {
      const areaGenerator = area<typeof this.dataset[number]>()
        .y0(this.mc.innerHeight)
        .y1(d => this.scaleY(d.values[i]))
        .x(d => this.scaleX(d.date));

      g.append('path')
        .attr('d', areaGenerator(this.dataset))
        .attr('fill', scaleFill(i.toString()));
    }

    for (let i = 0; i < colorDomain.length; i++) {
      const lineGenerator = line<typeof this.dataset[number]>()
        .x(d => this.scaleX(d.date))
        .y(d => this.scaleY(d.values[i]));

      g.append('path')
        .attr('d', lineGenerator(this.dataset))
        .attr('fill', 'none')
        .attr('stroke', scaleStroke(i.toString()));
    }

    g.append('line')
      .attr('x1', 0)
      .attr('y1', this.scaleY(50000))
      .attr('x2', this.mc.innerWidth)
      .attr('y2', this.scaleY(50000))
      .attr('stroke', '#000')
      .attr('stroke-width', 1);
  }

  private addInteractivity(): void {
    const g = this.createG();

    const scaleStealth = scaleBand<Date>()
      .domain(this.dataset.map(d => d.date))
      .range([0, this.mc.innerWidth]);

    let hoverRuler: Selection<SVGLineElement, unknown, null, undefined> | null = null;

    g.on('mouseenter', () => {
      hoverRuler = g.append('line')
        .attr('stroke', '#000')
        .attr('stroke-dasharray', 6);
    })
    .on('mouseleave', () => hoverRuler?.remove());

    g.selectAll('rect.stealth')
      .data(this.dataset)
      .enter()
      .append('rect')
      .attr('class', 'stealth')
      .attr('x', d => scaleStealth(d.date) ?? 0)
      .attr('y', 0)
      .attr('width', scaleStealth.bandwidth())
      .attr('height', this.mc.innerHeight)
      .attr('fill', 'transparent')
      .on('mouseenter', (e: MouseEvent, d) => {
        hoverRuler!
          .attr('x1', this.scaleX(d.date))
          .attr('y1', 0)
          .attr('x2', this.scaleX(d.date))
          .attr('y2', this.scaleY(this.mc.innerHeight))
      });
  }

  private createG(): typeof g {
    const g = this.svg.append('g').attr('transform', `translate(${this.mc.margin.left}, ${this.mc.margin.top})`);
    return g;
  }

  private getRandomNumberWithinRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private generateData() {
    const result = [];
    let date = new Date(Date.now() - 1000 * (60 * 5));
    date.setSeconds(0);

    for (let i = 0; i < 61; i++) {
      result.push(date);
      date = new Date(date);
      date.setSeconds(date.getSeconds() + 5);
    }
    
    return result.map(date => ({
      date,
      values: [
        65000 + this.getRandomNumberWithinRange(-30000, 30000),
        50000 + this.getRandomNumberWithinRange(-30000, 30000),
        35000 + this.getRandomNumberWithinRange(-30000, 30000),
      ]
    }));
  }
}
