export class AuthorizationError extends Error {
    constructor(message = 'Nemáte oprávnění k této akci.') {
        super(message)
        this.name = 'AuthorizationError'
    }
}
