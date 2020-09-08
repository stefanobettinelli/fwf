const postRequest = async (resource) => {
  const settings = {
    method: "POST",
  };
  try {
    const fetchResponse = await fetch(resource, settings);
    return await fetchResponse.json();
  } catch (e) {
    return e;
  }
};

const getRequest = async (resource) => {
  try {
    const fetchResponse = await fetch(resource);
    return await fetchResponse.json();
  } catch (e) {
    return e;
  }
};

export { getRequest, postRequest };
