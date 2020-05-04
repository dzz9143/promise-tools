export type ResolveType<T> = T extends (...args: any[]) => Promise<infer R> ? R : any;
export type AsyncFunction = (...args: any[]) => Promise<any>;