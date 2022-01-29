import { capitalize } from './support/helpers.js';

/**
 * A control for switching the rover.
 *
 * If the link corresponds to the current rover in the state, it will render
 * with the "active" decoration.
 *
 * @function
 *
 * @param {string} rover
 * @param {string} currentRover
 *
 * @returns {string}
 */
const RoverLink = (rover, currentRover) => {
    const styles = {
        default: 'decoration-red-300 hover:decoration-red-400',
        active: 'font-semibold text-gray-700 decoration-red-400',
    };

    const style = rover === currentRover ? styles.active : styles.default;

    return `
        <a href="${rover}" class="link rover-link ${style}" data-rover="${rover}">
            ${capitalize(rover)}
        </a>
    `;
};

export default RoverLink;
