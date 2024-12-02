import { Package } from "../package";

export interface Packages {
    limit : number,
    next : string,
    results : Package[],
    page : number,
    prev : number,
    total : number
}