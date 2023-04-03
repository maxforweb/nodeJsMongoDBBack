export const getSecret = (key: string) : string => {
    const value = process.env[key];
    if (!value) {
        // throw new InternalServerErrorException(`Process environment variable "${key}" is undefined`);
        throw new Error(`Process environment variable "${key}" is undefined`);
    }
    return value;
}