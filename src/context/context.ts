const data = {

}

const context = {
    push: (key: string, value: unknown) => {
        data[key] = value;
    },
    get: <T>(key: string): T => {
        return data[key];
    },
};

export default context;

