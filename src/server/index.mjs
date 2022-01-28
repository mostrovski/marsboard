import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Read environment variables.
dotenv.config();
const API_BASE = process.env.API_BASE;
const API_KEY = process.env.API_KEY;

// Configure the server.
const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Define paths.
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/modules', express.static(path.join(__dirname, '../../node_modules')));
app.use('/components', express.static(path.join(__dirname, '../components')));

/**
 * Compose request URI from base URI, resource, and API key.
 *
 * @function
 *
 * @param {string} resource
 *
 * @returns {string}
 */
const buildRequestUri = (resource) => {
    return `${API_BASE}/${resource}?api_key=${API_KEY}`;
};

/**
 * Request rover manifest.
 *
 * @function
 *
 * @param {string} rover
 *
 * @returns {Promise}
 */
const fetchManifest = (rover) => {
    return fetch(buildRequestUri(`manifests/${rover}`));
};

/**
 * Request rover photos for specific date.
 *
 * @function
 *
 * @param {string} rover
 * @param {string} date
 *
 * @returns {Promise}
 */
const fetchPhotos = (rover, date) => {
    return fetch(
        buildRequestUri(`rovers/${rover}/photos`) + `&earth_date=${date}`);
};

// Define routes.
app.get('/manifests/:rover', async (req, res) => {
    try {
        let manifest = await fetchManifest(req.params.rover)
            .then(res => res.json());
        res.send(manifest);
    } catch (err) {
        console.log('error:', err);
    }
});

app.get('/photos/:rover/:date', async (req, res) => {
    try {
        let photos = await fetchPhotos(req.params.rover, req.params.date)
            .then(res => res.json());
        res.send(photos);
    } catch (err) {
        console.log('error:', err);
    }
});

// Start.
app.listen(port, () => console.log(`Mars is listening on port ${port}!`));