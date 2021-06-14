import {PageSource} from "../test_runner";

export type Test = {
    name: string,
    run: (page: PageSource) => Promise<void>;
}
