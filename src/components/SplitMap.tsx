import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { MapPopup } from './MapPopup';

interface Location {
  name: string;
  country: string;
  postcode: string;
  coordinates: [number, number];
  timezone: string;
  currency: string;
  countryCode: string;
}

interface SplitMapProps {
  position: 'left' | 'right' | 'center';
  onMapInit: (map: Map) => void;
  selectedLocation: Location | null;
}

export function SplitMap({ position, onMapInit, selectedLocation }: SplitMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef<VectorSource | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    vectorSource.current = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource.current,
    });

    const osmLayer = new TileLayer({
      source: new OSM()
    });

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [osmLayer, vectorLayer],
      controls: defaultControls().extend([
        new ScaleLine({
          units: 'metric',
          bar: true,
          steps: 4,
          minWidth: 100
        })
      ]),
      view: new View({
        center: fromLonLat([0, 20]),
        zoom: 2,
        maxZoom: 19,
        minZoom: 2
      })
    });

    // Add click handler for marker
    mapInstance.current.on('click', (event) => {
      const feature = mapInstance.current?.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
        {
          hitTolerance: 5
        }
      );
      
      if (feature) {
        const coordinates = event.coordinate;
        const pixel = event.pixel;
        
        const mapElement = mapRef.current?.getBoundingClientRect();
        if (mapElement) {
          setPopupPosition({
            x: pixel[0],
            y: pixel[1]
          });
          setShowPopup(true);
        }
      } else {
        setShowPopup(false);
      }
    });

    // Change cursor to pointer when hovering over marker
    mapInstance.current.on('pointermove', (event) => {
      if (mapInstance.current) {
        const pixel = mapInstance.current.getEventPixel(event.originalEvent);
        const hit = mapInstance.current.hasFeatureAtPixel(pixel);
        mapInstance.current.getTarget().style.cursor = hit ? 'pointer' : '';
      }
    });

    onMapInit(mapInstance.current);

    return () => {
      mapInstance.current?.setTarget(undefined);
    };
  }, [onMapInit]);

  useEffect(() => {
    if (!selectedLocation || !vectorSource.current) return;

    vectorSource.current.clear();
    setShowPopup(false);

    const marker = new Feature({
      geometry: new Point(fromLonLat(selectedLocation.coordinates))
    });

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-red.png',
        scale: 0.5,
        crossOrigin: 'anonymous'
      })
    });

    marker.setStyle(markerStyle);
    vectorSource.current.addFeature(marker);

    const coordinates = marker.getGeometry()?.getCoordinates();
    if (coordinates && mapInstance.current) {
      mapInstance.current.getView().animate({
        center: coordinates,
        zoom: 12,
        duration: 1000
      });
    }
  }, [selectedLocation]);

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapRef} 
        className="h-full w-full"
        style={{ 
          background: 'rgb(240, 243, 245)',
          transition: 'all 0.3s ease-in-out'
        }} 
      />
      {showPopup && popupPosition && selectedLocation && (
        <MapPopup
          location={selectedLocation}
          position={popupPosition}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}