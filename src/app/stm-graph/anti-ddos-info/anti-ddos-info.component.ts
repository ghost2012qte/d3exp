import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ANTI_DDOS_MC } from './anti-ddos-info.config';
import { Selection, scaleLinear, scaleTime, select } from 'd3';

@Component({
  selector: 'app-anti-ddos-info',
  templateUrl: './anti-ddos-info.component.html',
  styleUrls: ['./anti-ddos-info.component.scss']
})
export class AntiDdosInfoComponent implements OnInit {
  readonly mc = ANTI_DDOS_MC;

  @ViewChild('svgRef', {static: true}) svgRef?: ElementRef<SVGElement>;

  ngOnInit(): void {
    const svg = select(this.svgRef!.nativeElement);
    const scaleX = this.drawScaleX(svg); 
    const scaleY = this.drawScaleY(svg);
  }

  private drawScaleX(svg: Selection<SVGElement, unknown, null, undefined>): typeof scaleX {
    const g = this.createG(svg);
    const dates = this.createDates();

    const scaleX = scaleTime()
      .domain([dates[0], dates[5]])
      .range([0, this.mc.innerWidth]);

    g.append('line')
      .attr('class', 'scaleX')
      .attr('x1', 0)
      .attr('y1', this.mc.innerHeight)
      .attr('x2', this.mc.innerWidth)
      .attr('y2', this.mc.innerHeight)
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    g.selectAll('text')
      .data([dates[1], dates[2], dates[3], dates[4]])
      .enter()
      .append('text')
      .attr('y', this.mc.innerHeight + 25)
      .attr('x', d => scaleX(d))
      .attr('font-size', '20')
      .attr('text-anchor', 'middle')
      .text(d => `${d.getHours()}:${d.getMinutes()}:0${d.getSeconds()}`);

    g.selectAll('line.splitter')
      .data([dates[1], dates[2], dates[3], dates[4]])
      .enter()
      .append('line')
      .attr('class', 'splitter')
      .attr('y1', this.mc.innerHeight + 4)
      .attr('y2', this.mc.innerHeight)
      .attr('x1', d => scaleX(d))
      .attr('x2', d => scaleX(d))
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    return scaleX;
  }

  private drawScaleY(svg: Selection<SVGElement, unknown, null, undefined>): typeof scaleY {
    const g = this.createG(svg);

    const scaleY = scaleLinear()
      .domain([0, 100000]) // TODO
      .range([this.mc.innerHeight, 0]);

    g.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', this.mc.innerHeight)
    .attr('stroke', '#000')
    .attr('stroke-width', 1);

    g.selectAll('text')
      .data([0, 50000, 100000]) // TODO
      .enter()
      .append('text')
      .attr('text-anchor', 'end')
      .attr("dominant-baseline", "central")
      .attr('font-size', '20')
      .attr('x', -10)
      .attr('y', d => scaleY(d))
      .text(d => d < 1000 ? d : d / 1000 + 'k');

    return scaleY;
  }

  private createG(svg: Selection<SVGElement, unknown, null, undefined>): typeof g {
    const g = svg.append('g').attr('transform', `translate(${this.mc.margin.left}, ${this.mc.margin.top})`);
    return g;
  }

  private createDates(): typeof dates {
    const dates = [
      new Date(Date.now() - 1000 * (60 * 5)),
      new Date(Date.now() - 1000 * (60 * 4)),
      new Date(Date.now() - 1000 * (60 * 3)),
      new Date(Date.now() - 1000 * (60 * 2)),
      new Date(Date.now() - 1000 * (60 * 1)),
      new Date(Date.now()),
    ] as const;

    dates.forEach(d => d.setSeconds(0));
    return dates;
  }
}
