// Code (specifically pin creation) was used from the following website:
//https://levelup.gitconnected.com/google-map-react-beginners-guide-85bb1a94b04a

import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import { useGeoLocation } from 'use-geo-location';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';

const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function MapPage() {
  const [defaultProps, setDefaultProps] = useState({
    center: {
      lat: 44.9740,
      lng: -93.2277
    },
    zoom: 11
  });

  const { latitude, longitude } = useGeoLocation();

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setDefaultProps({
        center: {
          lat: latitude,
          lng: longitude
        },
        zoom: 11
      });
    }
  }, []);

  // pin stuff
  const pinStyle={
    borderRadius: '10px',
    transform: 'matrix(-1, 0, 0, 1, 10, 0)'
  }
  const CurrentPin = (props) => {
    return(
      <div>
        <FontAwesomeIcon
          icon={faPerson}
          bounce size="2xl" 
          style={{ color: "#fc0303", }} 
        />
      </div>
    )
  }

  return (
    <>
      <h1>Congrats, you found a hidden page!</h1>
      <div style={{ height: '80vh', width: '90%', margin:'auto' }}>
        {defaultProps.center.lat && defaultProps.center.lng && (
          <GoogleMapReact
            bootstrapURLKeys={{ key: mapKey }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <CurrentPin 
              lat={defaultProps.center.lat} 
              lng={defaultProps.center.lng} 
            />
          </GoogleMapReact>
        )}
      </div>
    </>
  );
}




