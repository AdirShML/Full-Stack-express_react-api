const axios = require('axios');
const cheerio = require('cheerio');

// this file is the actual fetching process. axios used for manage the requests to the urls, cheerio for manipulating the content

// Function to fetch metadata from a single URL, i found couples shapes from where i can fetch the relevant data, 
// so i took all the shapes in mind, check wethear shape of metadata is the right one, and fetch it
async function fetchMetadata(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('title').text() || $('meta[property="og:title"]').attr('content');
        const description = $('meta[name="description"]').attr('content') 
                          || $('meta[property="og:description"]').attr('content') 
                          || $('meta[name="twitter:description"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content') 
                    || $('meta[name="twitter:image"]').attr('content') 
                    || $('meta[property="og:image:secure_url"]').attr('content')
                    || $('link[rel="image_src"]').attr('href')
                    || $('meta[itemprop="image"]').attr('content');

        const structuredDataScripts = $('script[type="application/ld+json"]').map((i, el) => {
            try {
                const json = JSON.parse($(el).html());
                if (json.image) return json.image;
                if (json.logo) return json.logo;
            } catch (e) {
                
            }
        }).get();

        const structuredImage = structuredDataScripts.find(url => url);

        return { title, description, image: image || structuredImage || 'https://via.placeholder.com/150' };

    } catch (error) {
        console.error(`Error while fetching data from ${url}:`, error);
        return { title: null, description: null, image: null };
    }
}

// Function to fetch metadata for a list of URLs
async function metadata_fetching(urls) {
    const results = await Promise.all(urls.map(url => fetchMetadata(url)));
    return results;
}

module.exports = metadata_fetching;