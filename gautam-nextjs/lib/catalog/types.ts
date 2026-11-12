export interface CatalogProduct {
  _id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: 'slippers' | 'clothing' | 'collections';
  subCategory?: string;
  isAvailable: boolean;
}
