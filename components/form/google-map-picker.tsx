import { Box } from "@mui/material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

const DefaultLocation = { lat: 39.9035557, lng: 32.6226794 };

const GoogleMapPicker = forwardRef(
  (
    {
      onChange,
      disabled,
      startFrom,
    }: {
      disabled?: boolean;
      onChange?: (latitude: number, longitude: number) => void;
      startFrom?: { lat: number; lng: number };
    },
    ref
  ) => {
    
    
    const [defaultLocation, setDefaultLocation] = useState(
      startFrom ? {lat: parseFloat(startFrom.lat+""),lng: parseFloat(startFrom.lng+"")} : DefaultLocation
    );
    const [location, setLocation] = useState(defaultLocation);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [placeNameQueue,setPlaceNameQueue] = useState<string[]>([]);

    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: "AIzaSyAkBhTU6Tc8FNdu64ZRG4rPm2bin7H7OOI",
    });

    const changeLocationUsingPlaceName = useCallback((str: string) => {
      if(!isLoaded) {
        setPlaceNameQueue(a=> [...a,str]);
        return;
      }
      if (str) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: str }, function (results, status) {
          if (
            status == google.maps.GeocoderStatus.OK &&
            results &&
            results.length &&
            map
          ) {
            const [lat, lng] = [
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng(),
            ];
            map.setCenter(new google.maps.LatLng({ lat, lng }));

            !!!disabled && onChange && onChange(lat, lng);
            setLocation({ lat, lng });
          }
        });
      }
    },[isLoaded,map,disabled]);
    useImperativeHandle(ref, () => ({
      changeLocationUsingPlaceName: changeLocationUsingPlaceName
      
    }));

    const handleChangeLocation = (event: google.maps.MapMouseEvent) => {
      if (map && event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        !!!disabled && onChange && onChange(lat, lng);
        setLocation({ lat: lat, lng: lng });
      }
    };

    const onLoad = useCallback(function callback(map: google.maps.Map) {
      setMap(map);
      if(placeNameQueue) {
        placeNameQueue.forEach(o => changeLocationUsingPlaceName(o));
        setPlaceNameQueue([]);
      }
    }, []);

    const onUnmount = useCallback(function callback(map: any) {
      setMap(null);
    }, []);

    return isLoaded ? (
      <Box sx={{ height: 435 }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={defaultLocation}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleChangeLocation}
          options={{streetViewControl: false}}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <>
            <Marker position={location}></Marker>
          </>
        </GoogleMap>
      </Box>
    ) : (
      <></>
    );
  }
);

export default GoogleMapPicker;
