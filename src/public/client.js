import { fromJS } from './modules/immutable/dist/immutable.es.js';

let store = fromJS({
    rovers: {
        curiosity: {},
        opportunity: {},
        spirit: {},
    },
    photos: {
        curiosity: null,
        opportunity: null,
        spirit: null,
    },
    currentRover: 'curiosity',
});

const $root = document.getElementById('root');

const App = (state) => {
    let name = state.get('currentRover');

    return `
        ${Header(name)}
        <main class="container mx-auto px-8 py-4">
            ${RoverInfo(name)}
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

const getManifest = (rover) => {
    fetch(`http://localhost:3000/manifests/${rover}`)
        .then(res => res.json())
        .then(res => updateStore(store, {
            rovers: {
                [rover]: res.photo_manifest,
            }
        }));

    return rover;
};

// ------------------------------------------------------  COMPONENTS

const RoverLink = (name, current) => {
    let style = (name === current) ? 'font-semibold text-gray-700 decoration-red-400' : 'decoration-red-300 hover:decoration-red-400';

    return `
        <a href="#" class="link rover-link ${style}" data-rover="${name}">
            ${capitalize(name)}
        </a>
    `;
};

const Header = (currentRover) => {
    return `
        <header class="h-36 md:h-20 pt-1 sm:pt-0 bg-gray-50 shadow-2xl sticky top-0 px-8">
            <div class="md:flex space-y-4 md:space-y-0 items-center justify-between h-full container">
                <div class="flex-1">
                    <h1 class="text-center md:text-left text-2xl uppercase tracking-wider text-gray-700 font-bold">
                        Marsboard
                    </h1>
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
    const background = {
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

    return `
        <span class="absolute inline-flex h-3 w-3 top-5">
            <span class="absolute inline-flex rounded-full h-full w-full animate-ping opacity-75 ${background[color]?.light ?? background.default.light}"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 ${background[color]?.dark ?? background.default.dark}"></span>
        </span>
    `;
};

const RoverInfo = (name) => {
    let data = store.getIn(['rovers', name]);

    if (data.size === 0) {
        getManifest(name);
    }

    return `
        <table class="table-auto border-collapse">
            <thead></thead>
            <tbody>
                <tr class="relative">
                    <td class="border-b p-4 pl-md-8 font-semibold">Rover</td>
                    <td class="border-b p-4 pr-md-8">
                        ${data.get('name') ?? PingingPoint('sky')}
                    </td>
                </tr>
                <tr class="relative">
                    <td class="border-b p-4 pl-md-8 font-semibold">Mission Status</td>
                    <td class="border-b p-4 pr-md-8 ${data.get('status') === 'active' ? 'text-teal-500' : 'text-stone-500'}">
                        ${data.get('status') ?? PingingPoint('sky')}
                    </td>
                </tr>
                <tr class="relative">
                    <td class="border-b p-4 pl-md-8 font-semibold">Launch date</td>
                    <td class="border-b p-4 pr-md-8">
                        ${data.get('launch_date') ?? PingingPoint()}
                    </td>
                </tr>
                <tr class="relative">
                    <td class="border-b p-4 pl-md-8 font-semibold">Landing date</td>
                    <td class="border-b p-4 pr-md-8">
                        ${data.get('landing_date') ?? PingingPoint('teal')}
                    </td>
                </tr>
                <tr class="relative">
                    <td class="border-b p-4 pl-md-8 font-semibold">Latest photos date</td>
                    <td class="border-b p-4 pr-md-8">
                        ${data.get('max_date') ?? PingingPoint('teal')}
                    </td>
                </tr>
            </tbody>
        </table>
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
