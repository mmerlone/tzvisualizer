
export interface TimezoneFeature {
  type: string;
  properties: {
    tzid: string;
    [key: string]: any;
  };
  geometry: any;
}

export interface TimezoneCollection {
  type: 'FeatureCollection';
  features: TimezoneFeature[];
}

export interface TimezoneInfo {
  tzid: string;
  offset: number;
  offsetFormatted: string;
}

export interface ViewState {
  selectedTzid: string;
  showSelectedArea: boolean;
  showGmtArea: boolean;
}
