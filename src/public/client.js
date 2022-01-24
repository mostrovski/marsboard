import { fromJS } from './modules/immutable/dist/immutable.es.js';

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

const capitalize = (word) => {
    return word[0].toUpperCase() + word.substr(1);
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

const RoverLink = (rover, currentRover) => {
    const styles = {
        default: 'decoration-red-300 hover:decoration-red-400',
        active: 'font-semibold text-gray-700 decoration-red-400',
    };

    const style = rover === currentRover ? styles.active : styles.default;

    return `
        <a href="#" class="link rover-link ${style}" data-rover="${rover}">
            ${capitalize(rover)}
        </a>
    `;
};

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

const PingingPoint = (color = 'default') => {
    const backgrounds = {
        default: {
            light: 'bg-red-300',
            dark: 'bg-red-400',
        },
        sky: {
            light: 'bg-sky-300',
            dark: 'bg-sky-400',
        },
        stone: {
            light: 'bg-stone-300',
            dark: 'bg-stone-400',
        },
        teal: {
            light: 'bg-teal-300',
            dark: 'bg-teal-400',
        },
    };

    const light = backgrounds[color]?.light ?? backgrounds.default.light;
    const dark = backgrounds[color]?.dark ?? backgrounds.default.dark;

    return `
        <span class="absolute inline-flex h-3 w-3 top-5">
            <span class="absolute inline-flex rounded-full h-full w-full animate-ping opacity-75 ${light}"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 ${dark}"></span>
        </span>
    `;
};

const TableRow = (property, value, valueStyle) => {
    return `
        <tr class="relative">
            <td class="border-b p-4 font-semibold">
                ${property}
            </td>
            <td class="border-b p-4 pl-10 ${valueStyle ?? ''}">
                ${value}
            </td>
        </tr>
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

const GalleryItem = (source) => {
    return `
        <div class="border-4 border-stone-500 rounded">
            <a href="${source}" target="_blank">
                <img src="${source}" alt="photo" class="w-full h-full" />
            </a>
        </div>
    `;
};

const GalleryPlaceholder = () => {
    return `
        <div class="mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div class="h-60 bg-stone-300 rounded animate-pulse"></div>
            <div class="h-60 bg-stone-400 rounded animate-pulse"></div>
            <div class="h-60 bg-stone-500 rounded animate-pulse"></div>
        </div>
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
