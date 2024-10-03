import { getManifest } from './support/helpers.js';
import PingingPoint from './PingingPoint.js';
import TableRow from './TableRow.js';

/**
 * Info table presenting the rover.
 *
 * If the state contains no rover data, the async API request is sent.
 *
 * While the data are coming back with the API response, it renders animated
 * placeholders.
 *
 * Once the data are ready, the component rerenders with actual rover values.
 *
 * @function
 *
 * @param {string} name
 * @param {Immutable.Map} state
 * @param {function(Immutable.Map, Object):void} updateCallback
 *
 * @returns {string}
 */
const RoverInfo = (name, state, updateCallback) => {
    const data = state.getIn(['rovers', name]);

    if (data.size === 0) {
        getManifest(name).then((response) =>
            updateCallback(state, {
                rovers: {
                    [name]: response.photo_manifest,
                },
            })
        );
    }

    // Extendable look-up table
    const presenter = {
        name: {
            value: data.get('name') ?? PingingPoint('sky'),
        },
        status: {
            value: data.get('status') ?? PingingPoint('sky'),
            style:
        data.get('status') === 'active' ? 'text-teal-500' : 'text-stone-500',
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

export default RoverInfo;
