export interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
}
export interface Address {
  formatted: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
  country: Country;
  city: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}
