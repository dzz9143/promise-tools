export function constant<T> (v: T) {
    return v;
}


export function createError(name: string, message: string): Error {
    const err = new Error(message);
    err.name = name;
    return err;
}