export const capitalize = (word) => {
    return word[0].toUpperCase() + word.substr(1);
};

export const RoverLink = (rover, currentRover) => {
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

export const PingingPoint = (color = 'default') => {
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

export const TableRow = (property, value, valueStyle) => {
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

export const GalleryItem = (source) => {
    return `
        <div class="border-4 border-stone-500 rounded">
            <a href="${source}" target="_blank">
                <img src="${source}" alt="photo" class="w-full h-full" />
            </a>
        </div>
    `;
};

export const GalleryPlaceholder = () => {
    return `
        <div class="mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div class="h-60 bg-stone-300 rounded animate-pulse"></div>
            <div class="h-60 bg-stone-400 rounded animate-pulse"></div>
            <div class="h-60 bg-stone-500 rounded animate-pulse"></div>
        </div>
    `;
};