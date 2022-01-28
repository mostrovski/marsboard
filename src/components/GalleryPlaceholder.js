const GalleryPlaceholder = () => {
    return `
        <div class="mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div class="h-60 bg-stone-300 rounded animate-pulse"></div>
            <div class="h-60 bg-stone-400 rounded animate-pulse"></div>
            <div class="h-60 bg-stone-500 rounded animate-pulse"></div>
        </div>
    `;
};

export default GalleryPlaceholder;
