import { Category } from "./category";
import { SourceFile } from "./source-file";

export interface Package {
    categories: Category[],
    sourceFiles : SourceFile[],
    description : string,
    id : string,
    name : string,
    previewImage : string,
    price : number
}
