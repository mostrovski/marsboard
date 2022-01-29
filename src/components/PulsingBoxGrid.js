/**
 * Animated box grid with the "pulsing" effect.
 *
 * If the color doesn't exist in the look-up table, or not provided at all,
 * the default color value is used.
 *
 * @function
 *
 * @param {string} color
 *
 * @returns {string}
 */
const PulsingBoxGrid = (color = 'default') => {
    // Extendable look-up table
    const backgrounds = {
        default: {
            first: 'bg-stone-300',
            second: 'bg-stone-400',
            third: 'bg-stone-500',
        },
        sky: {
            first: 'bg-sky-300',
            second: 'bg-sky-400',
            third: 'bg-sky-500',
        },
        red: {
            first: 'bg-red-300',
            second: 'bg-red-400',
            third: 'bg-red-500',
        },
        teal: {
            first: 'bg-teal-300',
            second: 'bg-teal-400',
            third: 'bg-teal-500',
        },

    };

    const background = backgrounds[color] ?? backgrounds.default;

    return `
        <div class="mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div class="h-60 ${background.first} rounded animate-pulse"></div>
            <div class="h-60 ${background.second} rounded animate-pulse"></div>
            <div class="h-60 ${background.third} rounded animate-pulse"></div>
        </div>
    `;
};

export default PulsingBoxGrid;
