const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());  // Middleware to parse JSON bodies

app.post('/places', async (req, res) => {
  try {
    const address = req.body.address;
    const filter = req.body.filter;

    // Geocode the address
    const geocodingResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: process.env.GEOCODING_API_KEY
        }
      });

    const lat = geocodingResponse.data.results[0].geometry.location.lat;
    const lng = geocodingResponse.data.results[0].geometry.location.lng;

    const types = {
      all: '',
      restaurant: 'restaurant',
      cafe: 'cafe',
      gym: 'gym',
      park: 'park'
      // Add more types and their corresponding values here
    };

    const selectedType = types[filter] || types.all;

    const placesResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: 10000,
        type: selectedType,
        key: process.env.PLACES_API_KEY
      }
    });

    const places = placesResponse.data.results;

    // Send the places data back to the client
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
