import fetch from "node-fetch";
import withRetry from "../src/withRetry";

const predicate = (err) => {
    console.warn("fail to fetch:", err.name, err.message);
    return err && err.code === "ECONNREFUSED";
};

const fetchWithRetry = withRetry(fetch, predicate, { limit: 3, timeout: 1000 });

fetchWithRetry("http://localhost:3000/api/v1/users")
    .then(resp => {
        console.log("resp:", resp);
    }).catch(err => {
        console.error("error:", err);
    });