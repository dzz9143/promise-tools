import withTimeout from "../src/withTimeout";
import sleep from "../src/sleep";

describe("withTimeout should", () => {
    it("be able to throw ExecutionTimeoutError if execution of async function execeeds the timeout", async () => {
        const fn = jest.fn();
        fn.mockImplementation(async () => {
            await sleep(3000);
            return "hello";
        });

        const f = withTimeout(fn, 1000);
        try {
            await f();
        } catch (err) {
            expect(err.name).toEqual("ExecutionTimeoutError");
        }
    });
});