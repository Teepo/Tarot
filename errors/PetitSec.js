export class PetitSecError extends Error {
    
    constructor(message) {
        
        super(message);
        
        this.name    = "PetitSecError";
        this.message = "Petit sec detected";
        this.state   = 'danger';
    }
}