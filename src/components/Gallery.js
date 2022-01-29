import { getPhotos } from './support/helpers.js';
import GalleryItem from './GalleryItem.js';
import PulsingBoxGrid from './PulsingBoxGrid.js';

/**
 * Image grid with the most recent rover photos.
 *
 * If the state contains no rover photos, the async API request is sent.
 *
 * While the photos data are coming back with the API response, it renders the
 * animated grid placeholder.
 *
 * Once the data are ready, the component rerenders with actual rover photos.
 *
 * @function
 *
 * @param {string} rover
 * @param {Immutable.Map} state
 * @param {function(Immutable.Map, Object):void} updateCallback
 *
 * @returns {string}
 */
const Gallery = (rover, state, updateCallback) => {
    const photos = state.getIn(['photos', rover]);
    const data = state.getIn(['rovers', rover]);

    if (photos.size === 0 && data.size !== 0 && data.get('max_date')) {
        getPhotos(rover, data.get('max_date'))
            .then(response => updateCallback(state, {
                photos: {
                    [rover]: response.photos,
                }
            }));
    }

    // Transform values into gallery items
    const items = photos.map(photo => GalleryItem(photo.img_src));

    if (items.size === 0) {
        return PulsingBoxGrid();
    }

    // Grid layouts look-up table for different numbers of items
    const layouts = {
        1: '',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-2 xl:grid-cols-3',
    };

    return `
        <div class="mt-3 grid ${layouts[items.size >= 3 ? 3 : items.size]} gap-3">
            ${items.join('')}
        </div>
    `;
};

export default Gallery;
