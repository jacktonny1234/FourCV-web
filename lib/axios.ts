"use client"

// Import the axios library
import axios from 'axios';

// const API_SERVER_URL = process.env.API_SERVER_URL;
const API_SERVER_URL = "http://192.168.140.160:8888/api/v1/";
// const API_SERVER_URL = "http://192.168.153.128:8888/api/v1/";

const $ = {
    // Make the POST request using the async/await syntax
    post: function (url: string, data: any, cb_ok: any = null,  cb_error:any = null){
            axios.post(
                API_SERVER_URL + url, data, 
                { 
                    headers: {
                    "Origin": "*",
                    "Content-Type": "application/json"
                    }
                }
            ).then((response) => {
                if( cb_ok )
                    cb_ok(response);
            }).catch((error) => {
                if (cb_error)
                    cb_error(error);
                console.log(`Error message: ${error.message}`);
                console.log(`Error code: ${error.code}`);
            });
    },
    // Make the POST request using the async/await syntax
    upload: function (url: string, data: any, file:any, cb_ok: any = null,  cb_error:any = null){
        axios.post(API_SERVER_URL + url, data,
            { 
                headers: {
                "Origin": "*",
                "Content-Type": "multi-part/data"
                }
            }
        ).then((response) => {
            if( cb_ok )
                cb_ok(response);
        }).catch((error) => {
            if (cb_error)
                cb_error(error);
            console.log(`Error message: ${error.message}`);
            console.log(`Error code: ${error.code}`);
        });
}
}

export default $;