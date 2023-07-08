const axios = require("axios");

// API Call Adaptor
const apiCall = async (
  requestType,
  endpoint,
  { headers = {}, body = {}, queryParams = {} }
) => {
  try {
    // Set default headers if provided
    const defaultHeaders = {
      "Content-Type": "application/json",
      // Add any other default headers here
    };
    headers = { ...defaultHeaders, ...headers };

    // Prepare request config
    const requestConfig = {
      method: requestType,
      url: endpoint,
      headers,
      params: queryParams,
      data: body,
      withCredentials: true, // Set credentials option to true
    };

    // Make API request
    const response = await axios(requestConfig);

    // Return response data in predefined format
    return {
      error: null,
      data: response.data,
    };
  } catch (error) {
    // Handle error and return error data in predefined format
    return {
      error: {
        errorCode: error.response?.status || 500,
        errorPage: endpoint,
        errorType: "api_error",
        errorMessage: error.message,
      },
      data: null,
    };
  }
};

(async function () {
  // Example usage of the API call adaptor
  const requestData = {
    headers: {
      Authorization: "Bearer your_token",
    },
    body: {
      // Request body data for POST requests
      // Add any required fields here
      username: "testuser",
      password: "test@123"
    },
    queryParams: {
      // Query parameters for GET requests
      // Add any required parameters here
    },
  };

  // Make API call using the adaptor
  const result = await apiCall(
    "POST",
    "http://localhost:3000/login",
    requestData
  );

  // Process the result
  if (result.error) {
    // Handle error
    console.error(result.error);
  } else {
    // Handle success
    console.log(result.data);
  }
})();
