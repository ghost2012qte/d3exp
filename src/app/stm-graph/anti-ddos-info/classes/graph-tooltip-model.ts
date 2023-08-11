export class GraphTooltipModel {
  constructor(
    public readonly mouseX: number,
    public readonly mouseY: number,
    public readonly title: string,
    public readonly values: Array<{ val: string | number, name: string, color: string }>,
  ) {}
}
