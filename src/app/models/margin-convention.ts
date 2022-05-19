import { IMarginConventionOptions } from "./margin-convention.types";

export class MarginConvention {

  get innerWidth(): number {
    return this.width - this.margin.left - this.margin.right;
  }

  get innerHeight(): number {
    return this.height - this.margin.top - this.margin.bottom;
  }
  
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly margin: Readonly<IMarginConventionOptions>)
  {
    if (margin.bottom < 0 || margin.top < 0 || margin.left < 0 || margin.right < 0) {
      throw new Error("Agrs error");
    }
  }

  static CREATE_MARGIN(
    side: number,
    override: Partial<IMarginConventionOptions> = {}
  ): IMarginConventionOptions {
    return { bottom: side, top: side, left: side, right: side, ...override };
  }
}
