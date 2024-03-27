export type LngLat = {
  lat: number;
  lng: number;
};

export type Coordinates = {
  placeName: string;
  type: string;
  coordinates: LngLat;
};
