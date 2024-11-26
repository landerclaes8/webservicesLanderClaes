import type { Entity } from "./common";

export interface User extends Entity {
    
    voornaam: string;
    naam: string;
    email: string;
    wachtwoord: string;
    winkelmand_id: number;
    favoriet_id: number;
}