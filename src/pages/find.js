// Code was used from the following website to implement autocomplete:
// https://www.telerik.com/blogs/integrating-google-places-autocomplete-api-react-app

import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { BsSearch } from "react-icons/bs";
import Categories from "../components/Categories/Categories";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

export default function AutoComplete() {
  const categories = [
    "Burgers",
    "Japanese",
    "Korean",
    "Chinese",
    "Italian",
    "Mexican",
    "Thai",
    "Pizza",
  ];

  const router = useRouter();

  const autoCompleteRef = useRef();
  const inputRef = useRef();

  // only returns restaurants and the data specified in 'fields'
  const options = {
    componentRestrictions: { country: "us" },
    fields: [
      "name",
      "formatted_address",
      "photos",
      "rating",
      "website",
      "geometry",
      "place_id",
    ],
    types: ["restaurant"],
  };

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace();

      if (!place.geometry) {
        // user entered the name of a restaurant and pressed the enter key (they didn't take any of the suggestions)
        // console.log('You entered: ' + place.name);
        router.push(`/search/${place.name}`);
      } else {
        // if a suggestion is taken, push to a different page where only the selected restaurant info is shown (autocomplete)
        // console.log(place.place_id);
        router.push(`/viewrestaurant/${place.place_id}`);
      }
    });
  }, []);

  return (
    <>
      <div className="columns is-centered">
        <div className="column has-text-centered is-three-quarters">
          <h2 className={styles.searchInstruction}>
            Search restaurants to leave a review or add to wish list.
          </h2>

          {/* search input */}
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input is-success is-medium"
                ref={inputRef}
                placeholder="Search restaurant..."
              />
            </div>
            <div className="control">
              <button className="button is-success is-medium">
                <BsSearch />
              </button>
            </div>
          </div>

          {/* manually add a restaurant button */}
          <button className="button is-success-light has-text-success-dark is-light">
            <Link href="/review">
              *Manually add a review or to your wish list.
            </Link>
          </button>

          {/* suggested category buttons */}
          <Categories categories={categories} />
        </div>
      </div>
    </>
  );
}
