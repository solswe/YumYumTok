// Review form to save restaurant found through search
import styles from "@/styles/Home.module.css";
import { addReview } from "@/modules/Data";
import { Rating } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";

export default function SearchReviewPage({ info }) {
  // bring name and address of the restaurant found through search
  // so name and address will be automatically filled for review
  const [sName, sAddress] = info;

  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const [newName, setNewName] = useState(sName);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newImage64, setNewImage64] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newAddress, setNewAddress] = useState(sAddress);

  async function add() {
    // name and date visited are required inputs -> check to make sure they've been filled
    if (newName == "") {
      document.getElementById("requiredInputWarning").innerHTML =
        "Restaurant name is required.";
      return;
    } else if (newDate == "") {
      document.getElementById("requiredInputWarning").innerHTML =
        "Date of visit is required.";
      return;
    }

    // once name and date are filled in, send data to database
    const token = await getToken({ template: "codehooks" });
    const newRestaurant = await addReview(
      token,
      newName,
      newReview,
      newRating,
      newDate,
      newImage64,
      newAddress,
      userId
    );
    setNewName(sName);
    setNewReview("");
    setNewRating("");
    setNewDate("");
    setNewImage("");
    setNewImage64("");
    setNewAddress(sAddress);
    setRestaurants(restaurants.concat(newRestaurant));
    setSubmitted(true);

    document.getElementById("requiredInputWarning").innerHTML = "";
  }

  if (loading) {
    console.log(loading);
    return <span className={styles.loading}> loading your reviews... </span>;
  } else {
    return (
      <>
        {/* review form to add new restaurant to your timeline */}
        <div className="container is-centered">
          {!submitted && (
            <div className="container mx-5">
              <h4 id="requiredInputWarning"></h4>
              <div className="field">
                <label className="label">Restaurant</label>
                <div className="control has-text-link-dark has-text-weight-bold">
                  {sName}
                </div>
              </div>

              <div className="field">
                <label className="label">Date of Visit</label>
                <div className="control">
                  <input
                    className="input is-link"
                    id="date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    onKeyDown={(e) => {if (e.key === "Enter") {add();}}}
                  ></input>
                </div>
                <p className="help is-link">*This field is required</p>
              </div>

              <div className="field">
                <label className="label">Address</label>
                <div className="control has-text-link-dark has-text-weight-bold">
                  {sAddress}
                </div>
              </div>

              <div className="field">
                <label className="label">Review</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    id="review"
                    type="textarea"
                    placeholder="Write a review..."
                    rows="5"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="field">
                <label className="label">Rating</label>
                <div className="control">
                  <Rating
                    name="half-rating"
                    id="rating"
                    defaultValue={0}
                    precision={0.5}
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    onKeyDown={(e) => {if (e.key === "Enter") {add();}}}
                  />
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
                  ) : (
                    <input
                      type="file"
                      name="myImage"
                      id="imageFileId"
                      className="imageClass"
                      onChange={(e) => {
                        console.log(e.target.files[0]);
                        setNewImage(e.target.files[0]);

                        // image base64 encoding
                        const selectedFile = e.target.files;
                        if (selectedFile.length > 0) {
                          const [imageFile] = selectedFile;
                          const fileReader = new FileReader();
                          fileReader.onload = () => {
                            const srcData = fileReader.result;
                            setNewImage64(srcData);
                            console.log("img encoding: ", srcData);
                          };
                          fileReader.readAsDataURL(imageFile);
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-link" onClick={add}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* when the form is submitted and saved */}
          {submitted && (
            <div className="box mx-5">
              <label className="label has-text-link">Successfully added!</label>
              <button className="button is-link is-light">
                <Link className="has-text-link" href="/home">
                  {" "}Go to your Timeline
                </Link>
              </button>
            </div>
          )}
        </div>
      </>
    );
  }
}
