export class UserNotExistError extends Error {
    
    constructor(message) {
        
        super(message);
        
        this.name    = "UserNotExistError";
        this.message = "This player doesn't exist";
        this.state   = 'danger';
    }
}