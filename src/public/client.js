import { fromJS } from './modules/immutable/dist/immutable.es.js';
import Header from './components/Header.js';
import RoverInfo from './components/RoverInfo.js';
import Gallery from './components/Gallery.js';

/**
 * Initial application state.
 *
 * @type {Immutable.Map}
 */
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

/**
 * Root.
 *
 * @type {Element}
 */
const $root = document.getElementById('root');

/**
 * Render main component in root.
 *
 * @function
 *
 * @param {Element} root
 * @param {Immutable.Map} state
 */
const render = async (root, state) => {
    root.innerHTML = App(state);
    document.dispatchEvent(new CustomEvent('rendered'));
};

/**
 * Merge changes into state and rerender.
 *
 * @function
 *
 * @param {Immutable.Map} state
 * @param {Object} changes
 */
const updateStore = (state, changes) => {
    store = state.mergeDeep(changes);
    render($root, store);
};

/**
 * Main component.
 *
 * @function
 *
 * @param {Immutable.Map} state
 *
 * @returns {string}
 */
const App = (state) => {
    const currentRover = state.get('currentRover');

    return `
        ${Header(currentRover)}
        <main class="container mx-auto px-8 py-4 lg:px-64">
            ${RoverInfo(currentRover, state, updateStore)}
            ${Gallery(currentRover, state, updateStore)}
        </main>
    `;
};

// Watch the current rover.
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

// Initialize the application.
window.addEventListener('load', () => {
    render($root, store);
});
