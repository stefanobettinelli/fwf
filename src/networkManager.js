const postRequest = async (resource, headers = null, payload = null) => {
  const settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  };
  try {
    const fetchResponse = await fetch(`/api${resource}`, settings);
    return await fetchResponse.json();
  } catch (e) {
    return e;
  }
};

const getRequest = async (resource) => {
  try {
    const fetchResponse = await fetch(`/api${resource}`);
    return await fetchResponse.json();
  } catch (e) {
    return e;
  }
};

const patchRequest = async (resource, payload = null, headers = null) => {
  const settings = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  };
  try {
    const fetchResponse = await fetch(`/api${resource}`, settings);
    return await fetchResponse.json();
  } catch (e) {
    return e;
  }
};

const deleteRequest = async (resource, headers) => {
  const settings = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
  try {
    const fetchResponse = await fetch(`/api${resource}`, settings);
    return await fetchResponse.json();
  } catch (e) {
    return e;
  }
};

export { getRequest, postRequest, patchRequest, deleteRequest };
