/**
 * Begin given string with a capital letter.
 *
 * @function
 *
 * @param {string} word
 *
 * @returns {string}
 */
export const capitalize = (word) => {
    return word[0].toUpperCase() + word.substring(1);
};

/**
 * Request rover manifest on the server.
 *
 * @function
 *
 * @param {string} rover
 *
 * @returns {Promise}
 */
export const getManifest = (rover) => {
    let manifest = fetch(`http://localhost:3000/manifests/${rover}`)
        .then(response => response.json());

    return manifest;
};

/**
 * Request rover photos for specific date on the server.
 *
 * @function
 *
 * @param {string} rover
 * @param {string} date
 *
 * @returns {Promise}
 */
export const getPhotos = (rover, date) => {
    let photos = fetch(`http://localhost:3000/photos/${rover}/${date}`)
        .then(response => response.json());

    return photos;
};
