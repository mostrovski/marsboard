const GalleryItem = (source) => {
    return `
        <div class="border-4 border-stone-500 rounded">
            <a href="${source}" target="_blank">
                <img src="${source}" alt="photo" class="w-full h-full" />
            </a>
        </div>
    `;
};

export default GalleryItem;
