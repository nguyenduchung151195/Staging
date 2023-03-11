import React, { memo, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, MapControl, Popup, ZoomControl, withLeaflet, useMap, useMapEvents } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import L from 'leaflet';
Leaflet.Icon.Default.imagePath = '../node_modules/leaflet';

delete Leaflet.Icon.Default.prototype._getIconUrl;

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
const center = {
  lat: 20.99213,
  lng: 105.785728,
};
const provider = new OpenStreetMapProvider();

function DraggableMarker(props) {
  const searchControl = new GeoSearchControl({
    provider: provider,
    style: 'bar',
    showMarker: true,
    showPopup: false,
    autoClose: true,
    retainZoomLevel: true,
    animateZoom: true,
    keepResult: true,
    searchLabel: 'Tìm kiếm',
    marker: {
      // optional: L.Marker    - default L.Icon.Default
      icon: new L.Icon.Default(),
      draggable: false,
    },
    popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
    resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
    maxMarkers: 1, // optional: number      - default 1
    updateMap: true, // optional: true|false  - default true
  });

  // const map = useMap();

  const [position, setPosition] = useState(props.location || null);
  // useEffect(() => {
  // }, [props.location])
  const map = useMapEvents({
    locationfound(e) {
      console.log(e.latlng, 'e.latlng1')

      setPosition(e && e.latlng);
      // if (position) return;
      // map.flyTo(e.latlng, map.getZoom());
    },
    dblclick(e) {
      console.log(e.latlng, 'e.latlng2')
      setPosition(e && e.latlng);
      props.onSelect(e.latlng);
      console.log('eeee', e);
    },
  });

  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Vị trí hiện tại của bạn</Popup>
    </Marker>
  );
}

function CustomMap(props) {
  const { zoom, onSelect, local, location, ...restProps } = props;
  const [selectedLatlng, setSelectedLatlng] = useState({
    lat: 20.99213,
    lng: 105.785728,
  });
  return (
    <MapContainer center={selectedLatlng} zoom={zoom} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }} {...restProps}>
      <TileLayer
        // attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        // url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker
        location={location}
        onSelect={latlng => {
          setSelectedLatlng(latlng);
          if (props.onSelect) {
            props.onSelect(latlng);
          }
        }}
      />
    </MapContainer>
  );
}
export default memo(CustomMap);
