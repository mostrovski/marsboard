import RoverLink from './RoverLink.js';

const Header = (currentRover) => {
    return `
        <header class="h-36 md:h-20 pt-1 sm:pt-0 bg-gray-50 shadow-2xl sticky z-50 top-0 px-8 xl:px-64">
            <div class="md:flex space-y-4 md:space-y-0 items-center justify-between h-full container">
                <div class="flex-1">
                    <a href="">
                        <h1 class="text-center md:text-left text-2xl uppercase tracking-wider text-gray-700 font-bold select-none">
                            Marsboard
                        </h1>
                    </a>
                </div>
                <div class="flex-1 text-center">
                    <div class="space-x-2">
                        ${RoverLink('curiosity', currentRover)}
                        ${RoverLink('opportunity', currentRover)}
                        ${RoverLink('spirit', currentRover)}
                    </div>
                </div>
                <div class="flex-1 text-center md:text-right">
                    <a href="https://open.spotify.com/album/6GjlSsOUUl1VlspqO2Vw9U"
                       target="_blank"
                       class="link decoration-sky-400 hover:decoration-sky-500"
                    >
                        Stay on Earth
                    </a>
                </div>
            </div>
        </header>
    `;
};

export default Header;
