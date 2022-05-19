import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, scaleLinear, Selection, ScaleLinear, pointer, drag, merge, max, timeout, timer, range, scaleQuantize, shuffle, interval } from 'd3';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../models/BaseComponent';
import { DatasetList } from '../models/dataset-list';
import { MarginConvention } from '../models/margin-convention';
import { DatasetService } from '../services/dataset.service';
import { IExampleDense } from '../services/dataset.types';

@Component({
  selector: 'app-chapter3',
  templateUrl: './chapter3.component.html',
  styleUrls: ['./chapter3.component.scss']
})
export class Chapter3Component extends BaseComponent implements OnInit {

  @ViewChild('example1', {static: true}) example1Ref?: ElementRef<SVGAElement>;
  @ViewChild('example2', {static: true}) example2Ref?: ElementRef<SVGAElement>;
  @ViewChild('example3', {static: true}) example3Ref?: ElementRef<SVGAElement>;
  @ViewChild('example4', {static: true}) example4Ref?: ElementRef<SVGAElement>;
  @ViewChild('example5', {static: true}) example5Ref?: ElementRef<SVGAElement>;

  constructor(private datasetService: DatasetService) {
    super();
  }

  ngOnInit(): void {
    this.datasetService.getDenseDataset()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.example1(data);
      });

    this.example2();
    this.example3();
    this.example4();
    this.example5();
  }

  private example1(dataset: readonly IExampleDense[]): void {
    if (this.example1Ref == null) return;

    const svg = select<SVGAElement, IExampleDense>(this.example1Ref.nativeElement);
    const [width, height] = svg.attr('viewBox').split(' ').slice(-2).map(Number);

    const colorScale1 = scaleLinear<string>()
      .domain([0, 10, 50])
      .range(['lime', 'yellow', 'red']);

    const colorScale2 = scaleLinear<string>()
      .domain([0, 10, 50])
      .range(['lime', 'yellow', 'blue']);

    const scaleX = scaleLinear()
      .domain([0, 300])
      .range([0, width / 2]);

    const scaleY = scaleLinear()
      .domain([0, 300])
      .range([0, height]);

    const g1 = svg.append('g');
    const g2 = svg.append('g').attr('transform', `translate(${width / 2}, 0)`);

    const drawCircles = (
      selection: Selection<SVGGElement, IExampleDense, null, undefined>,
      colorScale: ScaleLinear<string, string, never>,
      getX: (d: IExampleDense) => number,
      getY: (d: IExampleDense) => number
    ): Selection<SVGCircleElement, IExampleDense, SVGGElement, IExampleDense> => {
      const color = colorScale(Infinity);

      return selection.selectAll<SVGCircleElement, IExampleDense>('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', getX)
        .attr('cy', getY)
        .attr('fill', color)
        .attr('fill-opacity', 0.4);
    };
    
    const circles1 = drawCircles(g1, colorScale1, d => scaleX(d.A), d => scaleY(d.B));
    const circles2 = drawCircles(g2, colorScale2, d => scaleX(d.A), d => scaleY(d.C));
    
    const installEvents = (selection: Selection<SVGGElement, IExampleDense, null, undefined>) => {
      let isMousemoveInProgress = false;

      selection.attr('cursor', 'crosshair');

      selection.on('mousemove', function(event: MouseEvent) {
        if (isMousemoveInProgress) return;

        isMousemoveInProgress = true;

        // do calculation only once per frame
        timeout(() => {
          isMousemoveInProgress = false;
        });

        const pt = pointer(event, selection.node());
        const radiusMap = new Map<number, number>();

        circles1.attr('fill', function(_d, i) {
          const current = select(this);
          const dx = pt[0] - Number(current.attr('cx'));
          const dy = pt[1] - Number(current.attr('cy'));
          const r = Math.hypot(dx, dy);

          radiusMap.set(i, r);

          return colorScale1(r);
        });

        circles2.attr('fill', (_d, i) => colorScale2(radiusMap.get(i) as number));
      });

        selection.on('mouseleave', function() {
          circles1.attr('fill', _d => colorScale1(Infinity));
          circles2.attr('fill', _d => colorScale2(Infinity));
        });
    };

    g1.call(installEvents);
  }

  private example2(): void {
    if (this.example2Ref == null) return;

    let widget: Selection<SVGElement, unknown, null, undefined> | null = null;
    let color: string | null = null;

    const dragBehavior = drag<SVGElement, unknown>()
      .on('start', function() {
        color = select(this).attr('fill');
        widget = select(this).attr('fill', 'lime');
      })

      .on('drag', function(event) {
        const pt = pointer(event, select( this ).node());
        widget?.attr('cx', pt[0]).attr('cy', pt[1]);
      })

      .on('end', function() {
        widget?.attr('fill', color);
        color = null;
        widget = null;
      });

    select(this.example2Ref.nativeElement)
      .style('background', 'black')
      .selectAll<SVGElement, unknown>('circle')
      .attr('cursor', 'pointer')
      .call(dragBehavior);
  }

  private example3(): void {
    if (this.example3Ref == null) return;

    const MC = new MarginConvention(300, 150, MarginConvention.CREATE_MARGIN(15));

    const svg = select(this.example3Ref.nativeElement).attr('cursor', 'pointer');
    const g = svg.append('g').attr('transform', `translate(${MC.margin.left}, ${MC.margin.top})`);

    const dataset = new DatasetList([
      [ 2, 1, 3, 5, 7, 8, 9, 9, 9, 8, 7, 5, 3, 1, 2 ],
      [ 8, 9, 8, 7, 5, 3, 2, 1, 2, 3, 5, 7, 8, 9, 8 ]
    ]);

    const n = dataset.active.length;
    const maxDatasetValue = max(merge<number>([dataset.get(0), dataset.get(1)])) ?? 0;

    const scaleX = scaleLinear()
      .domain([0, n])
      .range([0, MC.innerWidth]);

    const scaleY = scaleLinear()
      .domain([0, maxDatasetValue])
      .range([MC.innerHeight, 0]);

    g.selectAll<SVGLineElement, number>('line')
      .data(dataset.active)
      .enter()
      .append('line')
      .attr('stroke', 'red')
      .attr('stroke-width', 10)
      .attr('x1', (_d, i) => scaleX(i) + 5)
      .attr('y1', () => scaleY(0))
      .attr('x2', (_d, i) => scaleX(i) + 5)
      .attr('y2', (d) => scaleY(d));

    svg.on('click', function(e: MouseEvent) {
      dataset.next();

      g.selectAll<SVGLineElement, number>('line')
        .data(dataset.active)
        .transition()
        .duration(1000)
        .delay((_d, i) => 200 * i)
        .attr('y2', d => scaleY(d));
    });
  }

  private example4(): void {
    if (this.example4Ref == null) return;

    const svg = select(this.example4Ref.nativeElement);
    
    const omega = 2 * Math.PI / 10000;
    const a = 3.2;
    const b = 5.9;
    
    let phi = omega;
    
    let crrX = 150 + 100;
    let crrY = 150 + 0;
    
    let prvX = crrX;
    let prvY = crrY;
    
    const bogusOpacity = Symbol('bogus_opacity');
    type ExtendedSvgLine = SVGLineElement & {[bogusOpacity]: number};

    const lissajousTimer = timer(t => {
      phi = omega * t;

      crrX = 150 + 100 * Math.cos(a * phi);
      crrY = 150 + 100 * Math.sin(b * phi);

      svg.selectAll<ExtendedSvgLine, unknown>('line')
        .each(function() {
          this[bogusOpacity] -= 0.007;
        })
        .attr('stroke-opacity', function() {
          return this[bogusOpacity];
        })
        .filter(function() {
          return this[bogusOpacity] < 0.05;
        })
        .remove();

      svg.append<ExtendedSvgLine>( 'line' )
        .each( function() {
          this[bogusOpacity] = 1.0;
        })
        .attr('x1', prvX)
        .attr('y1', prvY)
        .attr('x2', crrX)
        .attr('y2', crrY)
        .attr('stroke', 'brown')
        .attr('stroke-width', 2);

      prvX = crrX;
      prvY = crrY;
    });

    this.destroy$.subscribe(lissajousTimer.stop);
  }

  private example5(): void {
    if (this.example5Ref == null) return;

    const n = 50;
    const width = 300 / n;
    const updateTime = 3000;
    const svg = select(this.example5Ref.nativeElement);

    const dataset = range(n * n).map(d => ({
      x: d % n,
      y: d / n | 0,
      val: Math.random()
    }));

    const scale = scaleQuantize<string>().range(['white', 'red', 'black']);

    const nbs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

    svg.selectAll<SVGRectElement, unknown>('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', d => width * d.x)
      .attr('y', d => width * d.y)
      .attr('width', width - 1)
      .attr('height', width - 1)
      .attr('fill', d => scale(d.val));

    const votersInterval = interval(() => {
      shuffle(range(n * n).map(i => {
        const nb = nbs[nbs.length * Math.random() | 0];
        const x = (dataset[i].x + nb[0] + n) % n;
        const y = (dataset[i].y + nb[1] + n) % n;
        dataset[i].val = dataset[y * n + x].val;
      }));

      svg.selectAll<SVGRectElement, typeof dataset[0]>('rect')
        .data(dataset)
        .transition()
        .duration(updateTime)
        .delay((_d, i) => i * 0.25 * updateTime / (n * n))
        .attr('fill', d => scale(d.val));
    }, updateTime);

    this.destroy$.subscribe(votersInterval.stop);
  }

}
