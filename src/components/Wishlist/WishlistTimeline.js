// Wishlist timeline shows all wishlist items
import styles from "@/styles/Home.module.css";
import { getWishList, addWishList, deleteWishList } from "@/modules/Data";
import { useAuth } from "@clerk/nextjs";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen, faHeart, faLocationDot, faPersonRunning, faNoteSticky, faFaceSadTear } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import EditWishForm from ".//EditWish";

export default function Wishlist() {
  const [loading, setLoading] = useState(true);
  const [wishList, setWishList] = useState([]);
  const { isLoaded, userId, getToken } = useAuth();

  const [editing, setEditing] = useState(false);
  const [editInfo, setEditInfo] = useState([]);

  // get restaurant wishlist
  useEffect(() => {
    async function process() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        setWishList(await getWishList(token, userId));
        setLoading(false);
      }
    }
    process();
  }, [isLoaded]);

  // delete restaurant wishlist from list
  async function delWishList(wishItem) {
    const token = await getToken({ template: "codehooks" });
    try {
      await deleteWishList(token, wishItem._id);
    } catch (e) {
      console.log(e);
    }
    setWishList(await getWishList(token, userId));
  }

  // edit restaurant wishlist
  async function edit(wishItem) {
    setEditing(true);
    setEditInfo([wishItem.name, wishItem.address, wishItem.note, wishItem._id]);
  }

  if (loading) {
    console.log(loading);
    return (
      <span className={styles.loading}>
        Loading your wish list... &nbsp;
        <FontAwesomeIcon
          icon={faPersonRunning}
          bounce
          style={{ color: "#139a54" }}
        />
      </span>
    );
  } else {
    const wishListItems = wishList.map((wishItem) => {
      if (wishItem.userId == userId) {
        return (
          <>
            <div className="box has-text-centered">
              <section className="hero is-small">
                <div className="hero-body">
                  <p className="title">{wishItem.name}</p>
                  <p className="subtitle">
                    {wishItem.address ? (
                      <>
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          style={{ color: "#ffc038" }}
                        />
                        <span>&nbsp;&nbsp;</span>
                        {wishItem.address}
                      </>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </section>

              {wishItem.note ? (
                <>
                  <span id={styles.restaurantReview}></span>
                  <FontAwesomeIcon
                    icon={faNoteSticky}
                    style={{ color: "#ffc038" }}
                  />
                  <span>&nbsp;&nbsp;</span>
                  <span className={styles.keepNewlines}>{wishItem.note}</span>
                  <br></br>
                </>
              ) : (
                ""
              )}

              <div className="tags is-right">
                <span class="tag is-warning is-light">
                  {wishItem.createdOn}
                </span>
              </div>
              <div className="buttons is-right">
                <button
                  className="button is-inverted is-small"
                  onClick={() => {edit(wishItem);}}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  className="button is-inverted is-small"
                  onClick={() => {delWishList(wishItem);}}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
            <br></br>
          </>
        );
      }
    });

    return (
      <>
        <div className="columns is-centered">
          {/* Loading wishlist timeline */}
          {!editing && (
            <div className="column is-half">
              <h1 className={styles.titleTimeline}>
                Wish List
                <span>&nbsp;&nbsp;</span>
                <FontAwesomeIcon
                  icon={faHeart}
                  bounce
                  style={{ color: "#ffc038" }}
                />
              </h1>
              {wishListItems.length > 0 ? (
                  wishListItems
                ) : (
                    <>
                      <div className={styles.noticeBox}>
                        <p className={styles.noticeFont}>
                          It's empty{" "}
                          <FontAwesomeIcon icon={faFaceSadTear} style={{ color: "#3D4FB1" }}/>
                          <br/>
                        </p>
                        <div className={styles.noticeButton}>
                          <button className="button is-link is-light">
                            <Link href="/review">
                              Go to add review or wishlist manually
                            </Link>
                          </button>
                        </div>
                      </div>
                    </>
              )}
            </div>
          )}
          {/* Go to wishlist edit page */}
          {editing && (
            <div>
              <EditWishForm info={editInfo}></EditWishForm>
            </div>
          )}
        </div>
      </>
    );
  }
}
