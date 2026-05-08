import { Task } from "../models/index.ts";
declare function get(id: string): Task | undefined;
declare function index(): Task[];
declare const _default: {
    get: typeof get;
    index: typeof index;
};
export default _default;
