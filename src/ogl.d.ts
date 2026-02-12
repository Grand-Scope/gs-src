declare module 'ogl' {
  export class Renderer {
    constructor(options?: any);
    gl: any;
    dpr: number;
    setSize(width: number, height: number): void;
    render(options: { scene: any }): void;
  }
  export class Program {
    constructor(gl: any, options?: any);
    remove?(): void;
  }
  export class Mesh<T = any> {
    constructor(gl: any, options?: any);
    remove?(): void;
  }
  export class Triangle {
    constructor(gl: any);
    remove?(): void;
  }
}
