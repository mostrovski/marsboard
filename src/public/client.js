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

const root = document.getElementById('root');

const App = (state) => {
    let name = state.get('currentRover');

    return `
        ${RoverInfo(name)}
    `;
};

const render = async (root, state) => {
    root.innerHTML = App(state);
};

const updateStore = (state, newState) => {
    store = state.mergeDeep(newState);
    render(root, store);
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
                    <td class="border-b p-4 pl-md-8 font-semibold">Launch date</td>
                    <td class="border-b p-4 pr-md-8">
                        ${data.get('launch_date') ?? PingingPoint('sky')}
                    </td>
                </tr>
                <tr class="relative">
                    <td class="border-b p-4 pl-md-8 font-semibold">Landing date</td>
                    <td class="border-b p-4 pr-md-8">
                        ${data.get('landing_date') ?? PingingPoint()}
                    </td>
                </tr>
                <tr class="relative">
                    <td class="border-b p-4 pl-md-8 font-semibold">Status</td>
                    <td class="border-b p-4 pr-md-8 ${data.get('status') === 'active' ? 'text-teal-500' : 'text-stone-500'}">
                        ${data.get('status') ?? PingingPoint('teal')}
                    </td>
                </tr>
                <tr class="relative">
                    <td class="border-b p-4 pl-md-8 font-semibold">Most recent photos</td>
                    <td class="border-b p-4 pr-md-8">
                        ${data.get('max_date') ?? PingingPoint('teal')}
                    </td>
                </tr>
            </tbody>
        </table>
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

// ------------------------------------------------------  INIT

window.addEventListener('load', () => {
    render(root, store);
});
