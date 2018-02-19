# Blue Cat Networks - Dashboard UI

BCN web app


### Requirements

- NodeJS 5.5+


### Getting started

Create a config file from the provided example:

```bash
$ cp src/scripts/env.js.example src/scripts/env.js
```

Install Node packages:

```bash
$ npm install
```


### Automating development tasks with `gulp`

Gulp is a task runner that we use to execute the steps of the development workflow.
The default gulp task will take care of bundling the application sources (JS, CSS, HTML), spinning up a dev server and setting up some watch tasks to autoreload your browser when a change is detected.

> It's recommended to install gulp CLI globally for convenience by running:
> ```bash
> $ npm install -g gulp-cli
> ```

If you have gulp installed globally, you can run below command to start the gulp task:
```bash
gulp
```

If you prefer not to install it globally, you can run the gulp task directly:
```bash
$ node node_modules/gulp/bin/gulp.js
```

The default browser will be triggered and the application will be loaded automatically. Alternatively, you can go to:

```
http://localhost:3000
```

The dev server in use is [Browsersync](https://browsersync.io/), that allows syncronization of multiple browsers running at the same time for easier testing and development. You can point your browser to following URL to access Browsersync Control Panel:

```
http://localhost:3001
```


### Build for production

```bash
$ node_modules/gulp/bin/gulp.js build --release
# You could just run (if gulp installed globally):
$ gulp build --release
```

Note: Production build only produces static files in `./dist` directory and intended to be served on a real production server.
If you wish to serve the production build on the development mock server included in this repository, you can just run:
```bash
$ gulp serve --static
```
And you can open `http://localhost:3001` on your local browser.

### Guideline

- Documentation look at http://usejsdoc.org/
