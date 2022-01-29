# Marsboard

## A demo project showcasing work with promises, template literals, immutable data, and pure functions in JavaScript.

### Minimum requirements

#### UI:

- There should be a gallery of the most recent images sent from each mars rover;
- The launch date, landing date, name, and status along with any other information about the rover should be presented;
- There should be a possibility for the user to choose which rover's information they want to see (provide a way to dynamically switch the UI to view one of the three rovers);
- It should be responsive. Needs to look good (aka not broken) on phones (max width 768px) and desktop (min-width 991px, max-width 1824px). Tablet view is optional.

#### Code:

- Use only pure functions;
- Use at least one higher order function;
- Use the ImmutableJS library;
- Use Node/Express for the server part;
- Make successful calls to the NASA API;
- Hide any sensitive information from public view (use dotenv file).

### Approach

I wanted to write a vanilla JavaScript application that mimics some features of [React](https://reactjs.org/):

- working with the application state;
- coupling logic with templates and styling within (reusable) components;
- using components composition to build UI.

For the most part, it is possible to stay within the functional paradigm. However,
using only *pure* functions is hardly possible: one has to send API requests,
render components to the DOM, and listen to a minimum of events.

I ended up with the following:

1. [Immutable](https://immutable-js.com/) `Map` for the state object.
2. `Map.getIn` to traverse the tree of the state.
3. `Map.mergeDeep` to update the certain portion of the state.
4. Multiple components responsible for portions of logic and template.
5. Main component is a wrapper for other components that wrap other components, etc.
6. *Promise*-based communication with the server and API.
7. [Tailwind](https://tailwindcss.com/) for styling.

### How to run it

1. Generate API key at [NASA](https://api.nasa.gov/).
2. Make sure you have [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [Yarn](https://yarnpkg.com/getting-started/install) installed.
3. Clone, or download and extract the repository.
4. Change to the root of the project and run `cp .env-example .env`.
5. In the newly created *.env* file, replace *YOUR_API_KEY* with your actual key.
6. Run `yarn install` to install the dependencies.
7. Run `yarn styles` to (re)build CSS with [Tailwind](https://tailwindcss.com/).
8. Run `yarn start` to start the server powered by [Express](https://expressjs.com/).
9. In your terminal, you should see something like this:

   ```bash
   yarn run v1.22.17
   $ node src/server/index.mjs
   Mars is listening! Visit the dashboard at http://localhost:3000
   ```
10. Open provided link in your browser.

### Kudos

The starter code and project requirements were provided as a part of the [Intermediate JavaScript Nanodegree](https://www.udacity.com/course/intermediate-javascript-nanodegree--nd032) at Udacity.
