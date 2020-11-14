const axios = require("axios");
const { randomGif } = require("./gallery.service");

require('dotenv').config();

const fetchUrlsData = async(subject) => {
    try {
        const res = await axios.get(
            `https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}=${subject}&limit=30`
        );
        const gifData = await res.data.data;
        if (gifData.length === 0) {
            return null;
        }
        else {
            const gifUrlData = gifData.map((data) => ({
                url: data.images.original.url,
                height: data.images.original.height,
                width: data.images.original.width
            }));
            return gifUrlData 
        }
    
    } catch (e) {
        console.error(e);
    }
};

const getRndGif = async(subject) => {
    try {
        const gifUrlsData = await fetchUrlsData(subject);
        if (gifUrlsData !== null) {
            const rndGif = randomGif(gifUrlsData);
            return rndGif;
        }
        return gifUrlsData;
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    getRndGif
};