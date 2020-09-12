const postRequest = async (resource, payload = null) => {
  const settings = {
    method: "POST",
    body: JSON.stringify(payload),
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

const patchRequest = async (resource, payload = null) => {
  const settings = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  try {
    const fetchResponse = await fetch(resource, settings);
    return await fetchResponse.json();
  } catch (e) {
    return e;
  }
};

export { getRequest, postRequest, patchRequest };
