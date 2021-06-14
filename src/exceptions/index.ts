export const UNKNOWN = 0
export const SUCCESS = 1
export const BROKEN = 2
export const FAIL = 3


export class AutotestError extends Error {

    statusCode: number;

    reason: string

    constructor(statusCode?: number, reason?: string) {
        super();
        this.statusCode = statusCode ? statusCode : 0;
        this.reason = reason;
    }
}

export class ErrorSuccess extends AutotestError {
    constructor(reason?: string) {
        super(SUCCESS, reason);
    }
}

export class AutotestBroken extends AutotestError {
    constructor(reason?: string) {
        super(BROKEN, reason);
    }
}

export class AutotestFailed extends AutotestError {
    constructor(reason?: string) {
        super(FAIL, reason);
    }
}

export class AutotestUnknown extends AutotestError {
    constructor(reason?: string) {
        super(UNKNOWN, reason);
    }
}

type errorHandler = (code: number) => boolean

const
    errorHandlers: errorHandler[] = []

export const addErrorHandler = (errorHandler: errorHandler) => errorHandlers.push(errorHandler);

export function handleError({statusCode}: AutotestError) {
    for (let i = errorHandlers.length - 1; i >= 0; i--) {
        if (errorHandlers[i](statusCode)) {
            return;
        }
    }
}

export function initErrorHandlers() {
    const add = (expectedCode: number, reason: string, log: (any: any) => void = console.error) => {
        return (code) => {
            if (code == expectedCode) {
                log(reason);
                return true;
            }
            return false;
        }
    }

    addErrorHandler(code => {
        console.log(`Тип ошибки '${code}' неизвестен:`);
        return true
    });

    [
        code => {
            console.log(`Тип ошибки '${code}' неизвестен:`);
            return true
        },
        add(SUCCESS, "Успешно пройдены:",console.log),
        add(BROKEN, "Автотесты повреждены:"),
        add(FAIL, "Провалены:"),
        add(UNKNOWN, "Необработанные ошибки:")
    ].forEach(handler => addErrorHandler(handler))
}

