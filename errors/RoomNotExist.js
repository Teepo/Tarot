export class RoomNotExistError extends Error {
    
    constructor(message) {
        
        super(message);
        
        this.name    = "RoomNotExistError";
        this.message = "This room doesn't exist";
        this.state   = 'danger';
    }
}