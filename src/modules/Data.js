const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// get visited restaurant list
export async function getReviews(authToken, userName) {
  const result = await fetch(backend_base + "/home?userId=" + userName, {
    method: "GET",
    headers: { Authorization: "Bearer " + authToken },
  });
  return await result.json();
}

// add new review
export async function addReview(
  authToken,
  restaurantName,
  restaurantReview,
  restaurantRating,
  restaurantDate,
  restaurantImage,
  restaurantAddress,
  userName
) {
  const result = await fetch(backend_base + "/home", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: restaurantName,
      review: restaurantReview,
      rating: restaurantRating,
      userId: userName,
      imageContent: restaurantImage,
      dateVisited: restaurantDate,
      address: restaurantAddress,
    }),
  });
  return await result.json();
}

// edit review
export async function editReview(
  authToken,
  restaurantName,
  restaurantReview,
  restaurantRating,
  restaurantDate,
  restaurantImage,
  restaurantAddress,
  resId,
  userName
) {
  const result = await fetch(backend_base + "/home/" + resId, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: restaurantName,
      review: restaurantReview,
      rating: restaurantRating,
      userId: userName,
      imageContent: restaurantImage,
      dateVisited: restaurantDate,
      address: restaurantAddress,
    }),
  });
  return await result.json();
}

// delete review
export async function deleteReview(authToken, restaurantId) {
  const result = await fetch(backend_base + "/home/" + restaurantId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
  return await result.json();
}

// get user's wish list
export async function getWishList(authToken, userName) {
  const result = await fetch(backend_base + "/wishlist?userId=" + userName, {
    method: "GET",
    headers: { Authorization: "Bearer " + authToken },
  });
  return await result.json();
}

// add new wish list
export async function addWishList(
  authToken,
  restaurantName,
  restaurantReview,
  restaurantAddress,
  userName
) {
  const today = new Date().toISOString().substring(0, 10);
  const result = await fetch(backend_base + "/wishlist", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: restaurantName,
      note: restaurantReview,
      userId: userName,
      address: restaurantAddress,
      createdOn: today,
    }),
  });
  return await result.json();
}

// edit wish list
export async function editWishList(
  authToken,
  restaurantName,
  restaurantReview,
  restaurantAddress,
  resId,
  userName
) {
  const today = new Date().toISOString().substring(0, 10);
  const result = await fetch(backend_base + "/wishlist/" + resId, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: restaurantName,
      note: restaurantReview,
      userId: userName,
      address: restaurantAddress,
      createdOn: today,
    }),
  });
  return await result.json();
}

// delete wish list
export async function deleteWishList(authToken, restaurantId) {
  const result = await fetch(backend_base + "/wishlist/" + restaurantId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
  return await result.json();
}
