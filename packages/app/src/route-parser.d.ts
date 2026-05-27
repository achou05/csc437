declare module "route-parser" {
  export default class Route {
    constructor(path: string);
    match(path: string): Record<string, string> | false;
  }
}
