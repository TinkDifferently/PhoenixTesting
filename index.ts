import {runTest} from "./src/test_runner";
import context from "./src/context/context";
import * as config from "./src/resources/config.json"
import {failTest, successTest} from "./src/tests/aviasales";

context.push("base.url", config.baseUrl)

runTest([failTest, successTest])
