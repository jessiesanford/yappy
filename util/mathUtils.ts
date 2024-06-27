import * as _ from "lodash";

export namespace TMath {
  export type TBoundary = {
    top: number;
    left: number;
    right: number;
    bottom: number;
  }
  export type TRangeData = { p: number, a: number, b: number };
  export type TCoordinate = { x: number, y: number }
  export type TPoint = Point | TCoordinate | number
  export type TRectangle = Rectangle | TPoint | DOMRect | ClientRect | TBoundary
}

export class Point {
  private y_: number;
  private x_: number;
  private writeable_: boolean;

  get ReadOnly() {
    if (_.isNil(this.writeable_)) {
      this.writeable_ = true;
    }
    return !this.writeable_;
  }

  set ReadOnly(r) {
    this.writeable_ = !r;
  }

  /**
   * @return {number}
   */
  get x(): number {
    return this.x_;
  }

  set x(v) {
    if (!this.ReadOnly) {
      this.x_ = v;
    }
  }

  /**
   * @return {number}
   */
  get y(): number {
    return this.y_;
  }

  set y(v) {
    if (!this.ReadOnly) {
      this.y_ = v;
    }
  }

  public constructor(...args: (TMath.TPoint | boolean)[]) {
    if (args.length) {
      switch (true) {
        case _.some(args, _.isNull):
          throw new Error("PointException: Invalid arguments");
        case _.every(args, _.isBoolean):
          let w = args[0] as boolean;
          this.x = this.y = 0;
          this.ReadOnly = w;
          break;
        case _.every(args, (a: { x: number, y: number }) => a && (a instanceof Point || _.isNumber(a.x) && _.isNumber(a.y))):
          /** @type {Point} */
          let o = args[0] as TMath.TCoordinate;
          args[0] = o.x;
          args[1] = o.y;
        case _.every(args, _.isNumber):
        default:
          this.x = args[0] as number;
          this.y = args[1] as number;
          break;
      }
    } else {
      this.x = this.y = 0;
    }
  }

  /**
   * Add x and y values from this point
   * @param args
   */
  add(...args: TMath.TPoint[]): Point {
    let other = new Point(...args);
    return new Point(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtract x and y values from this point
   * @param args
   */
  subtract(...args: TMath.TPoint[]): Point {
    return this.add(new Point(...args).negate());
  }

  /**
   * Multiply this point by a scalar value
   * @param args
   */
  multiply(...args: number[]): Point {
    if (_.every(args, _.isNumber)) {
      let scalar = args[0] as number;
      return new Point(this.x * scalar, this.y * scalar);
    } else {
      return new Point;
    }
  }

  /**
   * Return this point with negated values.
   */
  negate(): Point {
    return this.multiply(-1);
  }

  /**
   * Returns whether this point is inside the passed Rectangle
   * @param args
   */
  inside(...args: TMath.TRectangle[]): boolean {
    let rect = new Rectangle(...args);
    return _.every([{
      p: this.x,
      a: rect.Left,
      b: rect.Right
    }, {
      p: this.y,
      a: rect.Top,
      b: rect.Bottom
    }] as TMath.TRangeData[], (value: TMath.TRangeData) => value.p >= value.a && value.p <= value.b);
  }

  /**
   * Distance between two points
   * @param args
   */
  distance(...args: TMath.TPoint[]): number {
    let displacement = this.subtract(new Point(...args));
    return Math.sqrt(displacement.x ** 2 + displacement.y ** 2);
  }

  /**
   * Snap this point to be inside of the passed Rectangle.
   * @param args
   */
  snap(...args: TMath.TRectangle[]): Point {
    if (args.length) {
      let p = new Rectangle(...args);
      return new Point(Math.min(p.Right, Math.max(p.Left, this.x)), Math.min(p.Bottom, Math.max(p.Top, this.y)));
    } else {
      return null;
    }
  }

  //There is no divide in vector math. Sorry.

  toString(): string {
    return `(${this.x}, ${this.y})`
  }
}

export class Rectangle {
  private cache_: {
    width?: number;
    height?: number;
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
    diagonal?: number;
    middle?: Point;
    corners?: TMath.TCoordinate[];
  };
  private origin_: Point;
  private final_: Point;
  private writeable_: boolean;

  get ReadOnly() {
    if (_.isNil(this.writeable_)) {
      this.writeable_ = true;
    }
    return !this.writeable_;
  }

  set ReadOnly(r) {
    this.writeable_ = !r;
  }

  /**
   * @return {Point}
   */
  get Origin(): Point {
    return /** @type {Point} */(this.origin_);
  }

  /**
   * The Origin of the rectangle.
   * @param {Point} p
   */
  set Origin(p: Point) {
    if (this.writeable_) {
      this.cache_ = {};
      this.origin_ = /** @type {Point} */(new Point(p));
      this.final_ = /** @type {Point} */(new Point(p));
    }
  }

  /**
   * The Final of the rectangle.
   * @return {Point}
   */
  get Final(): Point {
    return /** @type {Point} */(this.final_);
  }

  /**
   * @param {Point} p
   */
  set Final(p: Point) {
    if (this.writeable_) {
      this.cache_ = {};
      this.final_ = /** @type {Point} */(new Point(p));
    }
  }

  get Middle() {
    return _.isNil(this.cache_.middle) ? this.cache_.middle = new Point(this.Left + this.Width / 2, this.Top + this.Height / 2) : this.cache_.middle;
  }

  /**
   * Width of the rectangle
   * @return {number}
   */
  get Width(): number {
    return _.isNil(this.cache_.width) ? this.cache_.width = Math.abs(this.Final.x - this.Origin.x) : this.cache_.width;
  }

  /**
   * Height of the rectangle
   * @return {number}
   */
  get Height() {
    return _.isNil(this.cache_.height) ? this.cache_.height = Math.abs(this.Final.y - this.Origin.y) : this.cache_.height;
  }

  /**
   * The y-coord of the top side of this rectangle.
   * @return {number}
   */
  get Top(): number {
    return _.isNil(this.cache_.top) ? this.cache_.top = Math.min(this.Origin.y, this.Final.y) : this.cache_.top;
  }

  /**
   * The y-coord of the bottom side of this rectangle.
   * @return {number}
   */
  get Bottom(): number {
    return _.isNil(this.cache_.bottom) ? this.cache_.bottom = Math.max(this.Origin.y, this.Final.y) : this.cache_.bottom;
  }

  /**
   * The x-coord of the left side of this rectangle.
   * @return {number}
   */
  get Left(): number {
    return _.isNil(this.cache_.left) ? (this.cache_.left = Math.min(this.Origin.x, this.Final.x)) : this.cache_.left;
  }

  /**
   * The x-coord of the right side of this rectangle.
   * @return {number}
   */
  get Right(): number {
    return _.isNil(this.cache_.right) ? (this.cache_.right = Math.max(this.Origin.x, this.Final.x)) : this.cache_.right;
  }

  /**
   * Each Corner of this rectangle.
   * @return {Array<{x, y}>}
   */
  get Corners(): TMath.TCoordinate[] {
    return _.isNil(this.cache_.corners) ? this.cache_.corners = [{
      x: this.Left,
      y: this.Top
    }, {
      x: this.Left,
      y: this.Bottom
    }, {
      x: this.Right,
      y: this.Top
    }, {
      x: this.Right,
      y: this.Bottom
    }] : this.cache_.corners;
  }

  /**
   * Distance from corner to corner
   * @return {number}
   */
  get Diagonal(): number {
    return _.isNil(this.cache_.diagonal) ? this.cache_.diagonal = this.Final.distance(this.Origin) : this.cache_.diagonal;
  }

  get Area(): number {
    return this.Width * this.Height;
  }

  public constructor(...args: (TMath.TRectangle | boolean)[]) {
    this.cache_ = {};
    this.writeable_ = true;
    if (args.length) {
      switch (true) {
        case _.some(args, _.isNull):
          throw new Error("RectangleException: Invalid arguments");
        case _.every(args, _.isBoolean):
          let w = args[0];
          this.Origin = new Point;
          this.ReadOnly = w as boolean;
          break;
        case _.every(args, a => a instanceof Object && (a instanceof DOMRect || 'left' in a && 'right' in a && 'top' in a && 'bottom' in a)):
          let b = /** @type {DOMRect} */args[0] as DOMRect;
          args[0] = new Rectangle(b.left, b.top, b.right, b.bottom);
        case _.every(args, a => a instanceof Rectangle):
          let r = args[0] as Rectangle;
          this.cache_ = _.cloneDeep(r.cache_);
          args[0] = r.Origin;
          args[1] = r.Final;
        case _.every(args, (a: { x: number, y: number }) => a && (a instanceof Point || _.isNumber(a.x) && _.isNumber(a.y))):
          let o = args[0] as TMath.TCoordinate;
          let f = args[1] as TMath.TCoordinate;
          if (o) {
            args[0] = o.x;
            args[1] = o.y;
          }
          if (f) {
            args[2] = f.x;
            args[3] = f.y;
          } else {
            args[2] = args[0];
            args[3] = args[1];
          }
        case _.every(args, _.isNumber):
        default:
          let coords = args as number[];
          this.origin_ = new Point(...coords.slice(0, 2));
          this.final_ = new Point(...coords.slice(2));
      }
    } else {
      this.Origin = new Point;
    }
  }

  /**
   * For points only.
   * Determines if the point passed by args is inside this rectangle.
   * @param args
   * @return {boolean}
   */
  contains(...args: TMath.TPoint[]): boolean {
    if (args.length) {
      let p = new Point(...args);
      return p.inside(this);
    } else {
      return false;
    }
  }

  /**
   * For Rectangles only.
   * This implies:
   * - All the corners of this rectangle is inside of the passed rectangle
   * - The passed rectangle contains the area of this rectangle
   * @param args
   * @return {boolean}
   */
  inside(...args: TMath.TRectangle[]): boolean {
    let r = new Rectangle(...args);
    switch (true) {
      case !args.length:
        return false;
      //Every corner of this Rectangle is inside of the other rectangle
      case _.every(this.Corners, (p: TMath.TCoordinate) => r.contains(p)):
        return true;
      default:
        return false;
    }
  }

  /**
   * For Rectangles only.
   * This implies:
   * - It can be inside of the passed rectangle, or vice versa;
   * - One of the corners are contained in the passed rectangle, or vice versa;
   * - Rectangles have overlapping areas.
   * @param args
   * @return {boolean}
   */
  intersects(...args: TMath.TRectangle[]): boolean {
    let r = new Rectangle(...args);
    switch (true) {
      case !args.length:
        return false;
      //The minimum intersected area is non-negative on both axis; The easiest case
      case Math.max(this.Left, r.Left) <= Math.min(this.Right, r.Right) && Math.max(this.Top, r.Top) <= Math.min(this.Bottom, r.Bottom):
      //Some corner of the other Rectangle is inside of this rectangle
      case _.some(r.Corners, (p: TMath.TCoordinate) => this.contains(p)):
      //Some corner of this Rectangle is inside of the other rectangle
      case _.some(this.Corners, (p: TMath.TCoordinate) => r.contains(p)):
        return true;
      default:
        return false;
    }
  }

  /**
   * For Rectangles only.
   * Snaps the rectangle to be fully inside of another rectangle.
   * The rectangle passed is the rectangle that stays stationary.
   * Stationary rectangle must be larger for now, this will center under the smaller circumstance later.
   * @param args
   */
  snap(...args: TMath.TRectangle[]): Rectangle {
    if (args.length) {
      let r = new Rectangle(...args);
      let o = this.Origin.snap(r);
      let f = this.Final.snap(r);
      if (f.distance(o) === this.Diagonal) {
        return this;
      } else {
        let t = o.subtract(this.Origin).add(f.subtract(this.Final));
        if (t.distance() > 0) {
          let n = this.translate(t);
          let c = this.Middle.subtract(r.Middle);
          return n.translate(n.Width > r.Width ? c.x : 0, n.Height > r.Height ? c.y : 0);
        } else {
          return this;
        }
      }
    } else {
      return null;
    }
  }

  /**
   * For Rectangles or Points
   * The center of a point is simpler than a rectangle, but the rectangle can house an origin and a final.
   * If the rectangle only has an origin, it should work just fine for centering on the origin, instead of the center of a rectangle.
   * AKA the rectangle is treated like a point.
   * Returns a rectangle that is centered on a point or within a rectangle.
   * @param {TRectangleLike} args
   * @return {any}
   */
  center(...args: (TMath.TRectangle | TMath.TPoint)[]) {
    if (args.length) {
      let r = new Rectangle(...args);
      let d = r.Middle.subtract(this.Middle);
      return this.translate(d);
    } else {
      return null;
    }
  }

  /**
   * For Points only.
   * Move the rectangle and its entirety based on a passed point
   * @param args
   */
  translate(...args: TMath.TPoint[]): Rectangle {
    if (args.length) {
      let p = new Point(...args);
      return new Rectangle(this.Origin.add(p), this.Final.add(p));
    } else {
      return null;
    }
  }

  /**
   * For Points only.
   * Put the origin of the rectangle based on the passed point
   * @param args
   */
  move(...args: TMath.TPoint[]): Rectangle {
    if (args.length) {
      let p = new Point(...args);
      return new Rectangle(p, this.Final.subtract(this.Origin).add(p));
    } else {
      return null;
    }
  }

  toString(): string {
    return `{${this.Origin}, ${this.Final}}: ${this.Width.toFixed(2)} x ${this.Height.toFixed(2)}`;
  }
  toJSON(): TMath.TBoundary {
    return {
      top: this.Top,
      left: this.Left,
      right: this.Right,
      bottom: this.Bottom
    }
  }
}