import withRetry from "../src/withRetry";

describe("withRetry should", ()=> {
    it("be able to throw InvalidRetryOptions if options.limit is not a number or <= 0", async () => {
        const func = jest.fn();

        const predict = (err: any) => {
            return !!err;
        };

        try {
            withRetry(func, predict, { limit: 0 });
        } catch (err) {
            expect(err.name).toEqual("InvalidRetryOptions");
        }
    });

    it("be able to throw InvalidRetryOptions if options.timeout is not a number or <= 0", async () => {
        const func = jest.fn();

        const predict = (err: any) => {
            return !!err;
        };

        try {
            withRetry(func, predict, { timeout: 0 });
        } catch (err) {
            expect(err.name).toEqual("InvalidRetryOptions");
        }
    });

    it("be able to retry if async function reject with error", async () => {
        const func = jest.fn();
        func.mockRejectedValueOnce(new Error("first error"))
            .mockRejectedValueOnce(new Error("second error"))
            .mockResolvedValue(100);

        const predict = (err: any) => {
            return !!err;
        };

        const f = withRetry(func, predict);
        const result = await f();

        expect(result).toEqual(100);
        expect(func.mock.calls.length).toEqual(3);
    });

    it("be able to throw RetryFailed error if retry count exceeds the limit", async () => {
        const func = jest.fn();
        func.mockRejectedValueOnce(new Error("first error"))
            .mockRejectedValueOnce(new Error("second error"))
            .mockRejectedValueOnce(new Error("third error"))
            .mockRejectedValueOnce(new Error("fourth error"))
            .mockRejectedValueOnce(new Error("fifth error"));

        const predict = (err: any) => {
            return !!err;
        };
        const f = withRetry(func, predict, { limit: 1 });

        try {
            await f();
        } catch (err) {
            expect(err.name).toEqual("RetryLimitExceedError");
            expect(func.mock.calls.length).toEqual(2);
        }
    });

    it("be able to customize shouldRetry predicate function", async () => {
        const func = jest.fn();
        func.mockResolvedValueOnce(10)
            .mockResolvedValueOnce(20)
            .mockResolvedValueOnce(40)
            .mockResolvedValueOnce(100);

        const predict = (err: any, data: number) => {
            // retry if returned value less than 50
            return data < 50;
        };
        const f = withRetry(func, predict);
        const result = await f();
        expect(result).toEqual(100);
        expect(func.mock.calls.length).toEqual(4);
    });
});