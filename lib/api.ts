// Import the axios library
const axios = require('axios');
const API_SERVER_URL = process.env.API_SERVER_URL!;
const API = {
    // Make the POST request using the async/await syntax
    sendFile: async function (data :any) {
        try {

        // Await the POST request and assign the response object to a variable
        const response = await axios.post("http://192.168.140.160:8888/api/v1/face/normal", data, {
        headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    
        // Log the status code and the headers
        console.log(`Status code: ${response.status}`);
        console.log(`Headers: ${JSON.stringify(response.headers)}`);
    
        // Log the post information
        console.log(`Post ID: ${response.data.id}`);
        console.log(`Post Title: ${response.data.title}`);
        console.log(`Post Body: ${response.data.body}`);
        console.log(`Post User ID: ${response.data.userId}`);
        } catch (error: any) {
        // Log the error message and code
        console.log(`Error message: ${error.message}`);
        console.log(`Error code: ${error.code}`);
    
        // Log the response status and data if available
        if (error.response) {
            console.log(`Response status: ${error.response.status}`);
            console.log(`Response data: ${JSON.stringify(error.response.data)}`);
        }
    
        // Log the request method and path if available
        if (error.request) {
            console.log(`Request method: ${error.request.method}`);
            console.log(`Request path: ${error.request.path}`);
        }
    }
    }
  
}

export default API;