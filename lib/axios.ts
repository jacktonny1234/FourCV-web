// Import the axios library
import axios from 'axios';

const $ = {
    // Make the POST request using the async/await syntax
    post: function (data: any, cb_ok: any = null,  cb_error:any = null){
            axios.post(
                "http://192.168.140.160:8888/api/v1/face/facialfeatures", data, 
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
    upload: function (data: any, file:any, cb_ok: any = null,  cb_error:any = null){
        axios.post(
            "http://192.168.140.160:8888/api/v1/face/normal", data,
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