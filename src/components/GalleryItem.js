/**
 * A box with the image inside.
 *
 * @function
 *
 * @param {string} sourceLink
 *
 * @returns {string}
 */
const GalleryItem = (sourceLink) => {
    return `
        <div class="border-4 border-stone-500 rounded">
            <a href="${sourceLink}" target="_blank">
                <img src="${sourceLink}" alt="photo" class="w-full h-full" />
            </a>
        </div>
    `;
};

export default GalleryItem;
