// Wishlist form to save restaurant found through search
import { getWishList, addWishList, deleteWishList } from "@/modules/Data";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";

export default function WishForm({ info }) {
  // bring name and address of the restaurant found through search
  // so name and address will be automatically filled for wishlist
  const [sName, sAddress] = info;

  const [loading, setLoading] = useState(true);
  const [wishList, setWishList] = useState([]);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const [newName, setNewName] = useState(sName);
  const [newNote, setNewNote] = useState("");
  const [newAddress, setNewAddress] = useState(sAddress);

  // add restaurant wish list
  async function add() {
    // imageEncoding();
    const token = await getToken({ template: "codehooks" });
    const newWish = await addWishList(
      token,
      newName,
      newNote,
      newAddress,
      userId
    );
    setNewName(sName);
    setNewNote("");
    setNewAddress(sAddress);
    setWishList(wishList.concat(newWish));
    setSubmitted(true);
  }

  return (
    <>
      {/* Wishlist Form to add new restaurant */}
      <div className="container is-centered">
        {!submitted && (
          <div className="container mx-5">
            <div className="field">
              <label className="label">Restaurant</label>
              <div className="control has-text-warning-dark has-text-weight-bold">
                {sName}
              </div>
            </div>
            <div className="field">
              <label className="label">Address</label>
              <div className="control has-text-warning-dark has-text-weight-bold">
                {sAddress}
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

            <div className="field is-grouped ">
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
