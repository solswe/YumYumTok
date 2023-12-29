// Wishlist form
import { getWishList, addWishList, deleteWishList } from "@/modules/Data";
import { useAuth } from "@clerk/nextjs";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function WishForm() {
  const [loading, setLoading] = useState(true);
  const [wishList, setWishList] = useState([]);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newAddress, setNewAddress] = useState("");

  // add restaurant wish list
  async function add() {
    // name is required input
    if (newName == "") {
      document.getElementById("requiredInputWarning").innerHTML =
        "Restaurant name is required.";
      return;
    }

    const token = await getToken({ template: "codehooks" });
    const newWish = await addWishList(
      token,
      newName,
      newNote,
      newAddress,
      userId
    );
    setNewName("");
    setNewNote("");
    setNewAddress("");
    setWishList(wishList.concat(newWish));
    setSubmitted(true);
  }

  return (
    <>
      {/* Wishlist Form to add new restaurant */}
      <div className="container is-centered">
        {!submitted && (
          <div className="box mx-5">
            <section class="hero is-warning-light is-small">
              <div class="hero-body">
                <p class="title has-text-warning-dark">
                  Wish list<span>&nbsp;&nbsp;</span>
                  <FontAwesomeIcon
                    icon={faHeart}
                    bounce
                    style={{ color: "#ffc038" }}
                  />
                </p>
              </div>
            </section>
            <h4 id="requiredInputWarning"></h4>
            <div className="field">
              <label className="label">Restaurant</label>
              <div className="control">
                <input
                  className="input is-warning"
                  type="text"
                  id="restaurant"
                  placeholder="Restaurant Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {if (e.key === "Enter") {add();}}}
                ></input>
              </div>
              <p className="help is-warning">This field is required</p>
            </div>

            <div className="field">
              <label className="label">Address</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="restaurant"
                  placeholder="Restaurant Address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  onKeyDown={(e) => {if (e.key === "Enter") {add();}}}
                ></input>
              </div>
            </div>

            <div className="field">
              <label className="label">Note</label>
              <div className="control">
                <textarea
                  className="textarea"
                  id="review"
                  type="textarea"
                  rows="5"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button className="button is-warning" onClick={add}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* when the form is submitted and saved */}
        {submitted && (
          <div className="box mx-5">
            <label className="label has-text-warning-dark">Successfully added!</label>
            <button className="button is-warning is-light">
              <Link className="has-text-warning-dark" href="/wishlist">
                {" "}Go to your Wish List
              </Link>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
