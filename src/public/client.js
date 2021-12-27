let store = Immutable.fromJS({
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

const updateStore = (state, newState) => {
    store = state.mergeDeep(newState);
    render(root, store);
};

const render = async (root, state) => {
    root.innerHTML = App(state);
};


const App = (state) => {
    let name = state.get('currentRover');

    return `
        ${RoverInfo(name)}
    `;
};

window.addEventListener('load', () => {
    render(root, store);
});

// ------------------------------------------------------  COMPONENTS

const RoverInfo = (name) => {
    let data = store.getIn(['rovers', name]);

    if (data.size === 0) {
        getManifest(name);
    }

    let rover = data.toJS();

    return `
        <h3>${rover.name ?? ''}</h3>
    `;
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