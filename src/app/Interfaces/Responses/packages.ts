import { Package } from "../package";

export interface Packages {
    limit : number,
    next : string,
    packages : Package[],
    page : number,
    prev : number,
    total : number
}