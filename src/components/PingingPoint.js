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

export default PingingPoint;
