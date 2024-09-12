export class RoomAlreadyExistError extends Error {
    
    constructor(message) {
        
        super(message);
        
        this.name    = "RoomAlreadyExistError";
        this.message = "This room already exist";
        this.state   = 'danger';
    }
}