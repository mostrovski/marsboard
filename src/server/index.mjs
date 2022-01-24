import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const API_BASE = process.env.API_BASE;
const API_KEY = process.env.API_KEY;
const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const buildRequestUri = (resource) => {
    return `${API_BASE}/${resource}?api_key=${API_KEY}`;
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/modules', express.static(path.join(__dirname, '../../node_modules')));
app.use('/support', express.static(path.join(__dirname, '../support')));

app.get('/manifests/:rover', async (req, res) => {
    let rover = req.params.rover;
    try {
        let manifest = await fetch(buildRequestUri(`manifests/${rover}`))
            .then(res => res.json());
        res.send(manifest);
    } catch (err) {
        console.log('error:', err);
    }
});

app.get('/photos/:rover/:date', async (req, res) => {
    let rover = req.params.rover;
    let date = req.params.date;

    try {
        let photos = await fetch(
            buildRequestUri(`rovers/${rover}/photos`) + `&earth_date=${date}`)
            .then(res => res.json());
        res.send(photos);
    } catch (err) {
        console.log('error:', err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));