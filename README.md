## IMPORTANT NOTES:

Currently data is retrieved from a single endpoint which provides all the gnomes in the app. The benefit is that all gnomes are loaded at the very beginning causing a big request. Apart from that, a lot of gnomes is stored in memory despite it is not required as user will not see all. I'd suggest to implement another endpoint for filtering and to get paginated gnomes to load smaller pieces of the list.

Gnomes are loaded when user scrolls up and down. List shows almost 20 gnomes, no more is displayed until user scrolls. I that moment, the list is refreshed with new gnomes. The benefit is that UI is not blocked due to the amount of elements in the list.

#### Only mobile is supported.

From the excercise, street teams will use this app so desktop resolutions are not supported.

#### Tests support

As specified in the excercise, a very few amount of tests was created but if it was a productive app, every component should have their own unit tests (apart for the integration tests and others developed by QA).

#### TypeScript

TypeScript is a meta language that allows developer to type JavaScript. Personally, I find it really useful as too many issues can be caught before they go live.

#### Create React App

A very useful library which allows to create a project with a very few effort. CRA creates everything for the developer, and download required libraries such as react and for testing purposes.
A disadventage is that in order to edit webpack config or to create eslint rules, it is required to install some external libraries.

#### Material-UI
It's a library with predefined already built UI Components. It is used to avoid styling small components such as input, sliders and dropdowns. 

##

Steps to run the project:

1. Download repo.
2. `npm install`
3. `npm start`
4. Enjoy!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
