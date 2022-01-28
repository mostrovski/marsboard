import { capitalize } from './helpers.js';

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

export default RoverLink;
