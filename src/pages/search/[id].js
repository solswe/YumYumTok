import { useRouter } from 'next/router';
import homeStyles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useGeoLocation } from 'use-geo-location';
import Restaurant from '../../components/Restaurant/Restaurant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons';


export default function searchString() {
    const { latitude, longitude } = useGeoLocation();
    const [loading, setLoading] = useState(true);
    const [Restaurants, setRestaurant] = useState([]);

    const router = useRouter();
    const { id } = router.query;

    let service;
    let map;

    // function to intialize getting data from Google Place Library
    function initialize() {
        let currentLocation = new google.maps.LatLng(latitude,longitude);
    
        // a map div was placed in app.js (only way we could retrieve search results)
        // we don't insert a map only interested in the results given
        map = new google.maps.Map(document.getElementById('map'), {
            center: currentLocation,
            zoom: 15
        });
    
        let request = {
            location: currentLocation,
            radius: '1000',
            types: ['restaurant'],
            query: id
        };
        
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
    }
    
    // gives result of string/keyword searched
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            setRestaurant(results);
            setLoading(false);
        }
    }

    useEffect(() => {
        initialize()
    }, [longitude, latitude]);

    if (loading) {
        return <span className={homeStyles.loading}> 
        Loading your search... &nbsp;
        <FontAwesomeIcon icon={faPersonRunning} bounce style={{color: "#139a54",}} />
        </span>;

    } 

    // return search results/restaurant suggestions
    return (
        <div className='columns is-multiline'>
            {Restaurants.map((data) => (
                <div className='column is-half'>
                    <Restaurant key={data.place_id} data={data}/>
                </div>
            ))}
        </div>
    )    
}