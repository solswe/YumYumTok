import styles from '@/styles/Home.module.css'
import { getReviews, deleteReview, editReview } from "@/modules/Data";
import { Rating } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPen, faUtensils, faStar, faLocationDot, faQuoteLeft, faQuoteRight, faCalendarDays, faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import EditReviewForm from '../components/Review/EditReview';


export default function TimelinePage() {

    const [loading, setLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [editing, setEditing] = useState(false);
    const [editInfo, setEditInfo] = useState([]);

    // get user's restaurant review
    useEffect(() => {
        async function process() {
            if (userId) {
                const token = await getToken({ template: "codehooks" });
                setRestaurants(await getReviews(token, userId));
                setLoading(false);
            }
        }
        process();
    }, [isLoaded]);
    
    // if image exists for a review, add it to the review timeline
    function addImage(imageString64) {
        return <>
            <img src={imageString64} alt="restaurant image" width="300"></img><br></br>
        </>
    }
    
    // delete restaurant review from list
    async function del(restaurant) {
        const token = await getToken({ template: "codehooks" });
        try {
          await deleteReview(token, restaurant._id);
        } catch (e) {
          console.log(e);
        }
        setRestaurants(await getReviews(token, userId));
    }

    // edit restaurant review
    async function edit(restaurant){
        setEditing(true);
        setEditInfo([restaurant.name, restaurant.address, restaurant.review, restaurant.rating, restaurant.dateVisited, restaurant.imageContent, restaurant._id]);
    }

    if (loading) {
        // console.log(loading);
        return <span className={styles.loading}> 
        Loading your reviews... &nbsp;
        <FontAwesomeIcon icon={faPersonRunning} bounce style={{color: "#139a54",}} />
        </span>;
    } 
    else {
        // sort restaurant reviews in descending order (latest date to oldest date)
        restaurants.sort((p1, p2) => (p1.dateVisited > p2.dateVisited) ? -1 : (p1.dateVisited < p2.dateVisited) ? 1 : 0);
        // console.log("Sorted timeline: ", restaurants);

        // return review data (restaurant name, image, review, rating, date visited) for timeline page
        const restaurantListItems = restaurants.map((restaurant) => {

            // double check to make sure only the correct user's information is being displayed
            if(restaurant.userId == userId) {
                return <>
                    {/* restaurant name */}
                    <div className = "box has-text-centered">
                        <section className="hero is-small">
                            <div className="hero-body">
                                <p className="title">{restaurant.name}</p>
                                <p className="subtitle">
                                    {restaurant.address ? 
                                        <>
                                            <FontAwesomeIcon icon={faLocationDot} style={{color: "#48c38b",}} />
                                            <span>&nbsp;&nbsp;</span>{restaurant.address}
                                        </>
                                    : ""}
                                </p>
                            </div>
                        </section>

                        {/* image */}
                        {typeof restaurant.imageContent === "undefined" || restaurant.imageContent == "" ? 
                            console.log("No image available.") : addImage(restaurant.imageContent)}

                        {/* review */}
                        {restaurant.review ? 
                            <>
                                <FontAwesomeIcon icon={faQuoteLeft} style={{color: "#48c38b",}} />
                                <span>&nbsp;&nbsp;</span><span className={styles.keepNewlines}>{restaurant.review}</span><span>&nbsp;&nbsp;</span>
                                <FontAwesomeIcon icon={faQuoteRight} style={{color: "#48c38b",}} />
                                <br></br>
                            </>
                        : ""}

                        {/* rating */}
                        {restaurant.rating ? 
                            <>
                                <FontAwesomeIcon icon={faStar} style={{color: "#48c38b",}} />
                                <span>&nbsp;&nbsp;</span>{restaurant.rating}
                                <br></br>
                            </>
                        : ""}

                        {/* date visited */}
                        <FontAwesomeIcon icon={faCalendarDays} style={{color: "#48c38b",}} /><span>&nbsp;&nbsp;</span>
                        <span id = {styles.dateVisited}>{restaurant.dateVisited}</span>
                        <br></br>

                        {/* edit and delete review buttons */}
                        <div className="buttons is-right">
                            <button className="button is-inverted is-small" onClick={() => {edit(restaurant);}}>
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                            {/* Edit function is not made */}
                            <button className="button is-inverted is-small" onClick={() => {del(restaurant);}}>
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    </div>
                    <br></br>
                </>
            }}
        );
        

        return (
        <> 
            {/* Loading review timeline */}
            <div className="columns is-centered">
            {!editing && (
                <div className="column is-half">
                    <h1 className={styles.titleTimeline}>
                        <span>    Timeline</span>
                        <span>&nbsp;&nbsp;</span>
                        <FontAwesomeIcon icon={faUtensils} spin style={{color: "#ffc038",}} />
                        {/* <span>    Timeline</span> */}
                    </h1> <br></br>
                        {restaurantListItems}
                </div>
            )}
            {/* {console.log(editInfo)} */}
            {editing &&
                <div>
                    <EditReviewForm info={editInfo}></EditReviewForm>
                </div>
            }
            </div>   
        </>
        );
    }  
}