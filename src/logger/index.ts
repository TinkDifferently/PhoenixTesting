interface logger {
    error: (t: unknown) => void,
    info: (t: unknown) => void,
    debug: (t: unknown) => void,
}


const logger: logger = {
    debug(t: unknown): void {
        console.log(`[debug] ${t}`);
    }, error(t: unknown): void {
        console.log(`[error] ${t}`);
    }, info(t: unknown): void {
        console.log(`[info] ${t}`);
    }
}

export default logger;
