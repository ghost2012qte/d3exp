import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { select, schemeCategory10, Selection, pie, arc, scaleOrdinal, interpolate } from 'd3';
import { IDataKeyAccessor, IDataValueAccessor } from './animated-pie.types';

@Component({
  selector: 'app-animated-pie',
  template: '',
  styleUrls: ['./animated-pie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimatedPieComponent<T> implements OnInit, OnChanges {

  @Output() circleClicked = new EventEmitter<SVGCircleElement>();

  @Input() data: T[] = [];
  @Input() dataKeyAccessor: IDataKeyAccessor<T> = (_d, i) => i;
  @Input() dataValueAccessor: IDataValueAccessor<T> = Number;

  @Input() colorPalette: readonly string[] = schemeCategory10;

  private readonly WIDTH = 1000;
  private readonly HEIGHT = 500;

  private rootElement?: Selection<SVGGElement, unknown, null, undefined>;

  constructor(private ref: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    const self = this;

    const svg = select(this.ref.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${this.WIDTH} ${this.HEIGHT}`);

    const g = svg.append('g')
      .attr('transform', `translate(${this.WIDTH / 2}, ${this.HEIGHT / 2})`);

    svg.append('circle')
      .attr('cursor', 'pointer')
      .attr('cx', this.WIDTH / 2)
      .attr('cy', this.HEIGHT / 2)
      .attr('r', 50)
      .attr('fill', 'red')
      
      .on('click', function() {
        self.circleClicked.emit(this);
      });

    this.rootElement = g;
    this.drawPie(this.data);
  }

  ngOnChanges(ch: SimpleChanges): void {
    if ('data' in ch && !ch.data.firstChange) {
      this.drawPie(this.data);
    }
  }

  private drawPie(processedData: T[]): void {
    if (this.rootElement == null) return;

    const self = this;
    const radius = Math.min(this.WIDTH, this.HEIGHT) / 2;

    const pieLayout = pie<T>()
      .sort(null)
      .value((d, i, data) => {
        const number = this.dataValueAccessor(d, i ,data);
        return isNaN(number) ? 0 : number;
      })
      .padAngle(0.025)
      (this.data);

    const arcGenerator = arc<typeof pieLayout[number] | number>()
      .innerRadius(radius - 100)
      .outerRadius(radius - 20)
      .cornerRadius(10);

    const scaleColor = scaleOrdinal<string>()
      .domain(this.data.map((d, i, data) => this.dataKeyAccessor(d, i, data).toString()))
      .range(this.colorPalette);

    const selection = this.rootElement
      .selectAll<SVGPathElement, typeof pieLayout[number]>('path')
      .data(pieLayout);
    
    selection.exit<typeof pieLayout[number]>()
      .each(d => {
        console.log(d);
      })
      .remove();

    selection.enter()
      .append('path')
      .classed('petal', true)
      .each(function(d) {
        self.progress(this, d);
      })
      .attr('fill', d => scaleColor(this.dataKeyAccessor(d.data, d.index, this.data).toString()))
      .attr('d', arcGenerator);

    selection
      .transition()
      .duration(750)
      .attrTween('d', function(d) {
        const i = interpolate(self.progress<typeof d>(this), d);
        self.progress(this, i(0));
        return t => arcGenerator(i(t)) as string;
      });
  }

  private progress<D, E = SVGElement>(element: E  & { __progress__?: D }, value?: D): D | void {
    if (typeof value === 'undefined') return element.__progress__;
    element.__progress__ = value;
  }

}
