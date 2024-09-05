declare module 'leaflet-gpx' {
    import * as L from 'leaflet';
  
    class GPX extends L.FeatureGroup {
      constructor(gpx: string, options?: any);
    }
  
    export { GPX };
  }