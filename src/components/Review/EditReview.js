// Review form to edit saved review
import styles from '@/styles/Home.module.css'
import { addReview, editReview } from "@/modules/Data";
import { Rating } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from "react";


export default function EditReviewPage({info}) {

    // bring saved review contents
    const [currName, currAddress, currReview, currRating, currDate, currImage, resId] = info;

    const [newName, setNewName] = useState(currName);
    const [newReview, setNewReview] = useState(currReview);
    const [newRating, setNewRating] = useState(currRating);
    const [newDate, setNewDate] = useState(currDate);
    const [newImage64, setNewImage64] = useState(currImage);
    const [newImage, setNewImage] = useState("");
    const [newAddress, setNewAddress] = useState(currAddress);

    const [loading, setLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    
    
    async function saveEdit() {
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
        const newRestaurant = await editReview(token, newName, newReview, newRating, newDate, newImage64, newAddress, resId, userId);
        setSubmitted(true);
        document.getElementById("requiredInputWarning").innerHTML = "";
    }
    
    const refresh = () => window.location.reload(true)
    
    if (loading) {
        console.log(loading);
        return <span className={styles.loading}> Loading... </span>;
    } 
    else {
        return (
        <>  
            {/* call review form for editing*/}
            {/* input box will be filled with previously saved contents if any */}
            <div className="container is-centered">
            {!submitted && (
                <div className="container mx-5">
                    <h4 id = "requiredInputWarning"></h4>
                    <div className="field">
                        <label className="label">Restaurant</label>
                        <div className="control has-text-link-dark has-text-weight-bold">
                            <input
                                className="input is-primary"
                                type="text"
                                id = "restaurant"
                                placeholder="Restaurant Name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}}
                            ></input>
                        </div>
                        <p className="help is-primary">*This field is required</p>
                    </div>

                    <div className="field">
                        <label className="label">Date of Visit</label>
                        <div className="control">
                            <input
                                className="input is-primary"
                                id = "date"
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}}
                            ></input>
                        </div>
                        <p className="help is-primary">*This field is required</p>
                    </div>

                    <div className="field">
                        <label className="label">Address</label>
                        <div className="control has-text-link-dark has-text-weight-bold">
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
                                onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}}
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
                        <label className="label">Image</label>
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
                            <button className="button is-primary" onClick={saveEdit} >Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* when the edit request is submitted and saved */}
            {submitted && 
                <div className="box mx-5">
                    <label className="label has-text-link">Successfully edited!</label>
                    <button className="button is-link is-light" onClick={refresh}>
                        Go back to your Timeline
                    </button>
                </div>
            }
        </div>
        </>
        );
  
    }  
}