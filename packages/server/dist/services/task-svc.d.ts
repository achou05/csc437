import { Task } from "../models/index.ts";
declare function index(): Promise<Task[]>;
declare function get(id: string): Promise<Task | undefined>;
declare const _default: {
    index: typeof index;
    get: typeof get;
};
export default _default;
