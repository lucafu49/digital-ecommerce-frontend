export interface Category {
    id: string;
    name: string;
  }
  
  export interface GetCategoriesResponse {
    categories: Category[];
  }