import { Category } from "./category";

export interface Package {
    id : string,
    name : string,
    previewImage : string,
    description : string,
    price : number,
    Category: Category[]
}
