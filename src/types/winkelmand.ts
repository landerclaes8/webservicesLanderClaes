import type { Entity } from "./common";
import type { User } from './user';

export interface Winkelmand extends Entity {
    user: Pick<User, 'id'>
}

