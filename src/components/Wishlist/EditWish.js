// Wishlist form to edit saved wishlist
import styles from '@/styles/Home.module.css'
import { editWishList } from "@/modules/Data";
import { Rating } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from "react";


export default function EditWishlistPage({info}) {

    // bring saved wishlist contents
    const [currName, currAddress, currNote, resId] = info;
    const [newName, setNewName] = useState(currName);
    const [newNote, setNewNote] = useState(currNote);
    const [newAddress, setNewAddress] = useState(currAddress);
    

    const [loading, setLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [submitted, setSubmitted] = useState(false);

    
    async function saveEdit() {
        // name is required input
        if(newName == ""){
            document.getElementById("requiredInputWarning").innerHTML = "Restaurant name is required.";
            return;
        }

        const token = await getToken({ template: "codehooks" });
        const newRestaurant = await editWishList(token, newName, newNote, newAddress, resId, userId);
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
            {/* call wishlist form for editing*/}
            {/* input box will be filled with previously saved contents if any */}
            
            <div className="container is-centered">
            {!submitted && (
                <div className="box mx-5">
                    <h4 id = "requiredInputWarning"></h4>
                    <div className="field">
                        <label className="label">Restaurant</label>
                        <div className="control">
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
                        <p className="help is-success">This field is required</p>
                    </div>

                    <div className="field">
                        <label className="label">Address</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                id = "restaurant"
                                placeholder="Restaurant Address"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}}
                            ></input>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Note</label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                id = "review"
                                type="textarea"
                                rows="5"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}}
                            ></textarea>
                        </div>
                    </div>
                    
                    <div className="field is-grouped">
                        <div className="control">
                            <button className="button is-primary" onClick={saveEdit} >Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* when the form is submitted and saved */}
            {submitted && 
                <div className="box mx-5">
                    <label className="label has-text-link">Successfully edited!</label>
                    <button className="button is-link is-light" onClick={refresh}>
                        Go back to your Wish List
                    </button>
                </div>
            }
        </div>
        </>
        );
  
    }  
}