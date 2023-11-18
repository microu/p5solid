import { IP5Item, IP5TimeContext, P5TimeContext } from "../p5div/P5Items";

export class CircleItem<TContext extends IP5TimeContext= P5TimeContext>
  implements IP5Item<TContext>
{
  public state = ""
  constructor(
    public x: number,
    public y: number,
    public d: number,
    public color: string
  ) {}

  draw(p: import("p5"), _ctx: TContext): string {
    p.noStroke()
    p.fill(this.color)
    p.circle(this.x, this.y, this.d);
    return this.state;
  }
}
