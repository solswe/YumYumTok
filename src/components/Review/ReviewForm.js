// Review form
import styles from '@/styles/Home.module.css'
import { addReview } from "@/modules/Data";
import { Rating } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUtensils } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function ReviewPage() {

    const [loading, setLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [submitted, setSubmitted] = useState(false);

    const [newName, setNewName] = useState("");
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newImage64, setNewImage64] = useState("")
    const [newImage, setNewImage] = useState("");
    const [newAddress, setNewAddress] = useState("");

    
    
    async function add() {
        // name and date visited are required inputs -> check to make sure they've been filled
        if(newName == ""){
            document.getElementById("requiredInputWarning").innerHTML = "Restaurant name is required.";
            return;
        }
        else if (newDate == "") {
            document.getElementById("requiredInputWarning").innerHTML = "Date of visit is required.";
            return;
        }

        // once name and date are filled in, send data to database
        const token = await getToken({ template: "codehooks" });
        const newRestaurant = await addReview(token, newName, newReview, newRating, newDate, newImage64, newAddress, userId);
        setNewName("");
        setNewReview("");
        setNewRating("");
        setNewDate("");
        setNewImage("");
        setNewImage64("");
        setNewAddress("");
        setRestaurants(restaurants.concat(newRestaurant));
        setSubmitted(true);

        document.getElementById("requiredInputWarning").innerHTML = "";
    }
    
    if (loading) {
        console.log(loading);
        return <span className={styles.loading}> loading your reviews... </span>;
    } 
    else {
        return (
        <>  
            {/* review form to add new restaurant to your timeline*/}
            <div className="container is-centered">
            {!submitted && (
                <div className="box mx-5">
                    <section class="hero is-link-light is-small">
                    <div class="hero-body">
                        <p class="title has-text-link-dark">
                        Review<span>&nbsp;&nbsp;</span>
                        <FontAwesomeIcon icon={faUtensils} beat style={{color: "#3850b7",}} />
                        </p>
                    </div>
                    </section>
                    <h4 id = "requiredInputWarning"></h4>
                    <div className="field">
                        <label className="label">Restaurant</label>
                        <div className="control">
                            <input
                                className="input is-link"
                                type="text"
                                id = "restaurant"
                                placeholder="Restaurant Name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}}
                            ></input>
                        </div>
                        <p className="help is-link">*This field is required</p>
                    </div>

                    <div className="field">
                        <label className="label">Date of Visit</label>
                        <div className="control">
                            <input
                                className="input is-link"
                                id = "date"
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}}
                            ></input>
                        </div>
                        <p className="help is-link">*This field is required</p>
                    </div>

                    <div className="field">
                        <label className="label">Address</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                id = "address"
                                placeholder="Restaurant Address"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}}
                            ></input>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Review</label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                id = "review"
                                type="textarea"
                                placeholder="Write a review..."
                                rows="5"
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                // onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}}
                            ></textarea>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Rating</label>
                        <div className="control">
                            <Rating name="half-rating" 
                                id = "rating"
                                defaultValue={0} 
                                precision={0.5} 
                                value = {newRating}
                                onChange={(e) => setNewRating(e.target.value)}
                                onKeyDown={(e) => {if(e.key === 'Enter'){add()}}}/>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Image:</label>
                        <div className="control">
                        {newImage ? (
                            <div>
                                <img
                                    alt="not found"
                                    width={"250px"}
                                    src={URL.createObjectURL(newImage)}
                                />
                            <br />
                            <button onClick={() => setNewImage(null)}>Remove</button>
                            </div>    
                        ):
                        <input
                            type="file"
                            name="myImage"
                            id="imageFileId"
                            className="imageClass"
                            onChange={(e) => {
                                console.log(e.target.files[0]);
                                setNewImage(e.target.files[0])
                                
                                // image base64 encoding
                                const selectedFile = e.target.files;
                                if(selectedFile.length > 0) {
                                    const [imageFile] = selectedFile;
                                    const fileReader = new FileReader();
                                    fileReader.onload = () => {
                                        const srcData = fileReader.result;
                                        setNewImage64(srcData);
                                        console.log("img encoding: ", srcData);
                                    };
                                    fileReader.readAsDataURL(imageFile);
                                }}
                            }
                        />}
                        </div>
                    </div>

                    <div className="field is-grouped">
                        <div className="control">
                            <button className="button is-link" onClick={add}>Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* when the form is submitted and saved */}
            {submitted && 
                <div className="box mx-5">
                    <label className="label has-text-link">Successfully added!</label>
                    <button className="button is-link is-light">
                        <Link className="has-text-link" href="/home"> Go to your Timeline</Link>
                    </button>
                </div>
            }
            </div>
        </>
        );
  
    }  
}