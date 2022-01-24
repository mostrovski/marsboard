import { fromJS } from './modules/immutable/dist/immutable.es.js';
import { RoverLink, PingingPoint, TableRow, GalleryItem, GalleryPlaceholder } from './support/helpers.js';

let store = fromJS({
    rovers: {
        curiosity: {},
        opportunity: {},
        spirit: {},
    },
    photos: {
        curiosity: [],
        opportunity: [],
        spirit: [],
    },
    currentRover: 'curiosity',
});

const $root = document.getElementById('root');

const App = (state) => {
    const currentRover = state.get('currentRover');

    return `
        ${Header(currentRover)}
        <main class="container mx-auto px-8 py-4 lg:px-64">
            ${RoverInfo(currentRover, state)}
            ${Gallery(currentRover, state)}
        </main>
    `;
};

const render = async (root, state) => {
    root.innerHTML = App(state);
    document.dispatchEvent(new CustomEvent('rendered'));
};

const updateStore = (state, newState) => {
    store = state.mergeDeep(newState);
    render($root, store);
};

// ------------------------------------------------------  API CALLS

const getManifest = (rover, state) => {
    fetch(`http://localhost:3000/manifests/${rover}`)
        .then(res => res.json())
        .then(res => updateStore(state, {
            rovers: {
                [rover]: res.photo_manifest,
            }
        }));

    return rover;
};

const getPhotos = (rover, date, state) => {
    fetch(`http://localhost:3000/photos/${rover}/${date}`)
        .then(res => res.json())
        .then(res => updateStore(state, {
            photos: {
                [rover]: res.photos,
            }
        }));

    return rover;
};

// ------------------------------------------------------  COMPONENTS

const Header = (currentRover) => {
    return `
        <header class="h-36 md:h-20 pt-1 sm:pt-0 bg-gray-50 shadow-2xl sticky z-50 top-0 px-8 xl:px-64">
            <div class="md:flex space-y-4 md:space-y-0 items-center justify-between h-full container">
                <div class="flex-1">
                    <a href="">
                        <h1 class="text-center md:text-left text-2xl uppercase tracking-wider text-gray-700 font-bold select-none">
                            Marsboard
                        </h1>
                    </a>
                </div>
                <div class="flex-1 text-center">
                    <div class="space-x-2">
                        ${RoverLink('curiosity', currentRover)}
                        ${RoverLink('opportunity', currentRover)}
                        ${RoverLink('spirit', currentRover)}
                    </div>
                </div>
                <div class="flex-1 text-center md:text-right">
                    <a href="https://open.spotify.com/album/6GjlSsOUUl1VlspqO2Vw9U"
                       target="_blank"
                       class="link decoration-sky-400 hover:decoration-sky-500"
                    >
                        Stay on Earth
                    </a>
                </div>
            </div>
        </header>
    `;
};

const RoverInfo = (name, state) => {
    const data = state.getIn(['rovers', name]);

    if (data.size === 0) {
        getManifest(name, state);
    }

    const presenter = {
        name: {
            value: data.get('name') ?? PingingPoint('sky'),
        },
        status: {
            value: data.get('status') ?? PingingPoint('sky'),
            style: data.get('status') === 'active' ? 'text-teal-500' : 'text-stone-500',
        },
        launchDate: {
            value: data.get('launch_date') ?? PingingPoint(),
        },
        landingDate: {
            value: data.get('landing_date') ?? PingingPoint('teal'),
        },
        maxDate: {
            value: data.get('max_date') ?? PingingPoint('teal'),
        },
        totalPhotos: {
            value: data.get('photos')?.find(
                photo => photo.earth_date === data.get('max_date')
            )?.total_photos ?? PingingPoint('stone'),
            style: 'text-stone-500 font-semibold',
        },
    };

    return `
        <table class="table-auto border-collapse">
            <thead></thead>
            <tbody>
                ${TableRow('Rover', presenter.name.value)}
                ${TableRow('Mission', presenter.status.value, presenter.status.style)}
                ${TableRow('Launch date', presenter.launchDate.value)}
                ${TableRow('Landing date', presenter.landingDate.value)}
                ${TableRow('Latest photos date', presenter.maxDate.value)}
                ${TableRow('Number of photos', presenter.totalPhotos.value, presenter.totalPhotos.style)}
            </tbody>
        </table>
    `;
};

const Gallery = (rover, state) => {
    const photos = state.getIn(['photos', rover]);
    const data = state.getIn(['rovers', rover]);

    if (photos.size === 0 && data.size !== 0 && data.get('max_date')) {
        getPhotos(rover, data.get('max_date'), state);
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

// ------------------------------------------------------  INIT

document.addEventListener('rendered', () => {
    document.querySelectorAll('.rover-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            updateStore(store, {
                currentRover: event.target.dataset.rover,
            });
        });
    });
});

window.addEventListener('load', () => {
    render($root, store);
});
