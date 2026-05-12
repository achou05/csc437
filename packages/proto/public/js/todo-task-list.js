hydrate(src) {
  const token = localStorage.getItem("token");

  return fetch(src, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Please log in to view tasks.");
      }

      if (response.status !== 200) {
        throw new Error(`HTTP Status ${response.status}`);
      }

      return response.json();
    })
    .catch((error) => {
      console.log(`Could not fetch ${src}:`, error);
      return { tasks: [] };
    });
}