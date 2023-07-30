import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { arc, BaseType, CurveFactory, DefaultArcObject, line, local, pie, scaleLinear, scaleOrdinal, schemePastel2, select, Selection, symbol, symbols, symbolStar, SymbolType } from 'd3';

@Component({
  selector: 'app-chapter4',
  templateUrl: './chapter4.component.html',
  styleUrls: ['./chapter4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Chapter4Component implements OnInit {

  @ViewChild('example1', { static: true }) example1Ref?: ElementRef<SVGAElement>;
  @ViewChild('example2', { static: true }) example2Ref?: ElementRef<SVGAElement>;
  @ViewChild('example3', { static: true }) example3Ref?: ElementRef<SVGAElement>;
  @ViewChild('example4', { static: true }) example4Ref?: ElementRef<SVGAElement>;
  @ViewChild('example5', { static: true }) example5Ref?: ElementRef<SVGAElement>;
  @ViewChild('example6', { static: true }) example6Ref?: ElementRef<SVGAElement>;

  constructor() { }

  ngOnInit(): void {
    this.example1();
    this.example2();
    this.example3();
    this.example4();
    this.example5();
    this.example6();
  }

  private example1(): void {
    if (this.example1Ref == null) return;

    const dataset = [
      { x:  40, y:   0, val: 'A' },
      { x:  80, y:  30, val: 'A' },
      { x: 120, y: -10, val: 'B' },
      { x: 160, y:  15, val: 'A' },
      { x: 200, y:   0, val: 'C' },
      { x: 240, y:  10, val: 'B' }
    ];

    const starFactory = symbol()
      .type(symbolStar)
      .size(81);

    const scaleY = scaleLinear()
      .domain([-10, 30])
      .range([80, 40]);

    const scaleT = scaleOrdinal<string, SymbolType>()
      .domain(['A','B','C'])
      .range(symbols);

    const svg = select(this.example1Ref.nativeElement);

    svg.append('g')
      .selectAll<SVGElement, typeof dataset[number]>('path')
      .data(dataset)
      .enter()
      .append('path')
      .attr('d', starFactory)
      .attr('fill', 'red')
      .attr('transform', d => `translate(${d.x}, ${scaleY(d.y)})`);

    svg.append('g')
      .attr('transform', 'translate(300, 0)')
      .selectAll<SVGElement, typeof dataset[number]>('path')
      .data(dataset)
      .enter()
      .append('path')
      .attr('d', d => starFactory.type(scaleT(d.val))())
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('transform', d => `translate(${d.x}, ${scaleY(d.y)})`);

    svg.append('path')
      .attr('fill', 'black')
      .attr('d', 'M0 3 L8 3 L8 7 L15 0 L8 -7 L8 -3 L0 -3 Z')
      .attr('transform', 'translate(50, 50) rotate(-140)');
  }

  private example2(): void {
    if (this.example2Ref == null) return;

    const dataset = [ [180, 1], [260, 3], [340, 2], [420, 4] ];

    const scaleX = scaleLinear()
      .domain([100, 500])
      .range([0, 275]);

    select(this.example2Ref.nativeElement)
      .selectAll<SVGElement, typeof dataset[number]>('use')
      .data(dataset)
      .enter()
      .append('use')
      .attr('href', '#crosshair')
      .attr('stroke', 'black')
      .attr('stroke-width', d => 0.5 / Math.sqrt(d[1]))
      .attr('transform', d => `translate(${scaleX(d[0])}, 50) scale(${2 * d[1]})`);
  }

  private example3(): void {
    if (this.example3Ref == null) return;

    const svg = select(this.example3Ref.nativeElement);
    
    const scaleX = scaleLinear().domain([1,9]).range([50,250]);
    const scaleY = scaleLinear().domain([0,5]).range([175,25]);

    const dataset = [[1, 1], [2, 2], [3, 4], [4, 4], [5, 2], [6, 2], [7, 3], [8, 1], [9, 2]]
      .map(d => [scaleX(d[0]), scaleY(d[1])])
      .sort((a, b) => {
        if (a[0] > b[0]) return  1;
        if (a[0] < b[0]) return -1;
        return 0;
      });

    const curveCustomLinear: CurveFactory = (context) => {
      const points: [number, number][] = [];
      const EMPTY_FN = () => {};

      return {
        areaEnd: EMPTY_FN,
        areaStart: EMPTY_FN,
        lineStart: EMPTY_FN,

        // Registering points
        point: (x, y) => {
          points.push([x, y]);
        },

        lineEnd: () => {
          if (points.length <= 0) return;

          let i = 0;

          // Move to the first point
          context.moveTo(points[0][0], points[0][1]);

          while (i < points.length - 1) {
            context.lineTo(points[i + 1][0], points[i + 1][1]);
            i++;
          }
        }
      }
    };

    const lineGenerator = line()
      .curve(curveCustomLinear)
      .defined((_d, _i) => true);

    // Generate a line
    svg.append('g')
      .append('path')
      .attr('d', lineGenerator(dataset as [number, number][]))
      .attr('fill', 'none')
      .attr('stroke', 'red');

    // Draw circles for the individual data points
    svg.append('g')
      .selectAll<SVGElement, typeof dataset[number]>('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('cx', d => d[0])
      .attr('cy', d => d[1]);
  }

  private example4(): void {
    if (this.example4Ref == null) return;

    const dataset = [
      { name: "Jim", votes: 12 },
      { name: "Sue", votes:  5 },
      { name: "Bob", votes: 21 },
      { name: "Ann", votes: 17 },
      { name: "Dan", votes:  3 }
    ];

    const pieLayout = pie<typeof dataset[number]>()
      .value(d => d.votes)
      .padAngle(0.025)
      (dataset);

    const arcGenerator = arc<typeof pieLayout[number]>()
      .innerRadius(50)
      .outerRadius(150)
      .cornerRadius(10);

    const scaleColor = scaleOrdinal<string>()
      .domain(pieLayout.map(String))
      .range(schemePastel2);

    const g = select(this.example4Ref.nativeElement).append('g')
      .attr('transform', 'translate(300, 175)');

    g.selectAll<SVGPathElement, typeof pieLayout[number]>('path')
      .data(pieLayout)
      .enter()
      .append('path')
      .classed('petal', true)
      .attr('d', arcGenerator)
      .attr('fill', d => scaleColor(d.index.toString()))
      .attr('data-color', d => scaleColor(d.index.toString()));

    g.selectAll<SVGTextElement, typeof pieLayout[number]>('text')
      .data(pieLayout)
      .enter()
      .append('text')
      .text(d => d.data.name)
      .attr('x', d => arcGenerator.innerRadius(60).centroid(d)[0])
      .attr('y', d => arcGenerator.innerRadius(60).centroid(d)[1])
      .attr('font-family', 'sans-serif')
      .attr('font-size', 14)
      .attr('text-anchor', 'middle');
  }

  private example5(): void {
    if (this.example5Ref?.nativeElement == null) return;

    const arcGenerator = arc<void>()
      .cornerRadius(10)
      .innerRadius(50)
      .outerRadius(150)
      .startAngle(1.5 * Math.PI)
      .endAngle(1.75 * Math.PI);
    
    const arcGenerator2 = arc<{ start: number, end: number }>()
      .cornerRadius(10)
      .innerRadius(50)
      .outerRadius(150)
      .startAngle(d => Math.PI * d.start / 180)
      .endAngle(d => Math.PI * d.end / 180 );

    const arcSpec: DefaultArcObject = {
      innerRadius: 50,
      outerRadius: 150,
      startAngle: 0,
      endAngle: 0.25 * Math.PI
    };

    const g = select(this.example5Ref.nativeElement)
      .append('g')
      .attr('transform', 'translate(200, 200)');

    g.append('path').attr('d', arcGenerator());
    g.append('path').attr('d', arc().cornerRadius(10)(arcSpec));
    g.append('path').attr('d', arcGenerator2({ start: 60, end: 90 }));
  }

  private example6(): void {
    if (this.example6Ref?.nativeElement == null) return;

    const labels = ["Hello", "World", "How", "Are", "You?"];

    const scaleX = scaleLinear()
      .domain([0, labels.length - 1])
      .range([100, 500]);

    const scaleY = scaleLinear()
      .domain([0, labels.length - 1])
      .range([50, 150]);

    // sticker component example
    const sticker = <GElement extends BaseType, Datum>(
      s: Selection<GElement, Datum, BaseType, unknown>,
      text: string
    ): void => {
      const fontSize = 14;
      const width = 70;
      const height = 30;

      s.append('rect')
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('width', width)
        .attr('height', height)
        .attr('x', width / 2 * -1)
        .attr('y', height / 2 * -1)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .classed('frame', true);

      s.append('text')
        .attr('x', 0)
        .attr('y', 5)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', fontSize)
        .classed('label', true)
        .text(text || String);
    };

    // translate attr component example (d3.local)
    const translate = <GElement extends BaseType, Datum, PElement extends BaseType, PDatum>(
      s: Selection<GElement, Datum, PElement, PDatum>,
      x: number | ((d: Datum, i: number) => number),
      y: number | ((d: Datum, i: number) => number)
    ): void => {
      // this logic is bullshit but only to know d3.local exists...

      const localX = local<number>();
      const localY = local<number>();

      s.each(function (d, i) {
        localX.set(this as Element, typeof x === 'number' ? x : x(d, i));
      });

      s.each(function (d, i) {
        localY.set(this as Element, typeof y === 'number' ? y : y(d, i));
      });

      s.attr('transform', function () {
        return `translate(${localX.get(this as Element)}, ${localY.get(this as Element)})`;
      });
    };

    select(this.example6Ref.nativeElement)
      .selectAll<SVGGElement, string>('g')
      .data(labels)
      .enter()
      .append('g')
      .call(translate, (_d: string, i: number) => scaleX(i), (_d: string, i: number) => scaleY(i))
      .call(sticker);

    select(this.example6Ref.nativeElement)
      .append('g')
      .call(translate, 75, 150)
      .call(sticker, "I'm fine!")
      .selectAll('.label')
      .attr('fill', 'red');
  }

}
