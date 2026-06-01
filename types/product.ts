export interface ProductData {
  id: string | number;
  name: string;
  price: number;
  image_url: string;
  colors: string[];
  model_url?: string;     
  description?: string;   
}