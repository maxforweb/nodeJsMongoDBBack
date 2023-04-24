export const BusinessExceptionDescriptions = {
    USER_NOT_FOUND_BY_EMAIL: (email: string): string => `User not found by email: ${email}`,
    USER_ALREADY_EXIST: (email: string): string => `User with email: ${email}, already exists`
}