import { Category } from "./category";

export interface Package {
    categories: Category[],
    description : string,
    id : string,
    name : string,
    previewImage : string,
   
    price : number
}
