export const enum GraphTooltipPosition {
  Left,
  Right,
  Center,
};

export class GraphTooltipModel {
  constructor(
    public readonly position: GraphTooltipPosition,
    public readonly mouseX: number,
    public readonly mouseY: number,
    public readonly title: string,
    public readonly values: Array<string | number>,
  ) {}
}
