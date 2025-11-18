export default interface Accommodation {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  starRating: number;
  policies: string;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  upDatedAt: Date;
}
