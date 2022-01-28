import { getPhotos } from './support/helpers.js';
import GalleryItem from './GalleryItem.js';
import GalleryPlaceholder from './GalleryPlaceholder.js';

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

    const items = photos.map(photo => GalleryItem(photo.img_src));

    if (items.size === 0) {
        return GalleryPlaceholder();
    }

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
