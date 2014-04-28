# grunt-config-plus

> Define package, description, aliases and task dependencies in an object/file per grunt task.

## Getting Started
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-config-plus --save-dev
```

Once the plugin is installed, load it in your Gruntfile.js like this:

```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt);
};
```

## The "grunt-config-plus" plugin
This grunt configuration structure, like others, fetches its config from files. What I have not yet found so far is something that only loads the npm modules I need to run. Granted, grunt is fast after the first load, but I wanted grunt to always run as snappy as possible. 

So here is grunt-config-plus. Define all your tasks fully within the scope of a single object. Refer tot those object with glob-paths, if you want. Create aliases for those tasks. List them, or hide them from the list. Print an explanation for your tasks. Json it, js it, whatever you fancy. It's so convenient. 

### Overview
Point to a directory where you hold all your config options:
```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt, {
        init: 'grunt/*.*',
    });
};
```

Now you can put all your task definitions in your specified folder.

### A task definition
A task definition is a config file in js, json or yml format. If you use js, use module.exports.

#### Task definition parameters
A task definition may consist of:

* __name__: the grunt task name and grunt config name. Derived from the name of the config file.
* __config__: `{Object}` the configuration object that you would normally feed with grunt.initConfig under property 'name'
* __description__: `{String}` description of what this task does. Displayed when running `grunt tasks`
* __execute__: `{Function|Array}` a function or array of task names that will be executed when this task is run.
* __package__: `{String}` a package the task(s) needs in order to run. What you would usually feed to grunt.loadNpmTasks
* __dependencies__: `{Array}` An array of task names this task depends on. If execute is an array of task names, it automatically appends dependencies.
* __alias__: `{Array}` one or multiple alternative task names for the task.
* __visible__: `{Boolean}` hides the task definition from the tasks list (see `grunt tasks`).

#### Task definition examples
A config file named `browserify.json`, producing the task `grunt browserify` and alias `grunt b`:
```json
{
    "description": "Continuously builds index.js into bin/js-utils.js (dev)",
    "package": "grunt-browserify",
    "config": {
        "dev": {
            "files": {
                "bin/index.js": "index.js"
            },
            "options": {
                "watch": true,
                "keepAlive": true
            }
        }
    },
    "alias": "b"
}
```

A config file named `buildBootstrap.js`, producing the task `grunt buildBootstrap` not listed by `grunt tasks`:
```js
module.exports = function(grunt, ROOT) {
    return {
        "description": "Creates custom bootstrap.js",
        "execute": function(param) {
            // entire function here
        },
        "visible": false
    }
};
```

A config file named `install.json`, producing the task `grunt install` and alias `grunt i` that run `grunt bower`, `grunt less` and `grunt buildBootstrap`:
```json
{
    "description": "Installs all project dependencies",
    "execute": ["bower", "less", "buildBootstrap"],
    "alias": "i"
}
```

### Config
The config is the optional object passed as second parameter to grunt-config-plus, next to grunt itself.

#### Config properties
The config may have the following properties:

* __init__: `{glob-path|Object}` This parameter must yield an object containing all your task definitions. Interpreter searches again for glob-paths 1 level deep in the object.
* __baseDir__: `{String}` The path prepended to any glob-path used. Defaults to the cwd of Gruntfile.js.
* __override__: `{glob-path|Object}` Pass various overrides to affect the initialization process. All objects extend/overwrite the existing objects.
 * __init__: `{Object}` Appends the init config after it has been assembled. This includes the default tasks.
 * __config__: `{Object}` Appends the grunt config (derived from the 'config' properties of all your task definitions) after it has been assembled.
 * __dependencies__: `{String|Array}` Appends the dependencies after they have been assembled. These tasks will always be loaded (not necessarily run). Pass * to load all tasks.
* __style__: `{glob-path|Object}` Customize the layout of the default tasks. Only one style property is possible. See grunt help for color styles.
 * __color__: `{String}` common style
 * __descr__: `{String}` style for descriptions only
 * __task__: `{String}` style for task names
 * __indent__: `{String}` character string used for indenting relative to the console.

Note that all results of a glob-path are automatically converted to an object, namespaced by file name.

#### Config default
```js
{
    init: 'grunt/**/*.*',
    baseDir: process.cwd(),
    style: {
        color: 'yellow',
        indent: '  ',
        descr: 'cyan',
        task: 'bold'
    }
}
```

#### Config examples
Fetches config files from directory `grunt-config` relative to `Gruntfile.js`:
```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt, {
        init: 'grunt-config/*.*'
    });
};
```

Hides all default tasks except help:
```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt, {
        override: {
            init: {
                default: { visible: false },
                view: { visible: false },
                status: { visible: false },
                tasks: { visible: false }
            }
        }
    });
};
```

Always loads all task definitions (and their dependencies and packages):
```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt, {
        override: {
            dependencies: '*'
        }
    });
};
```

### Tools
These tasks are added by default, and will automatically be overridden if you choose to set another task under that name.

* __tasks, t__: view all available tasks
* __status__: compare package.devDependencies with the packages defined in your config files.
* __help, h__: show tips, or, with other tasks, displays the description of the tasks
* __view, v__: view an object tree containing all loaded configs, as well as grunt itself. Optional path opens the (nested) property inside that object.

## Release History
_(Nothing yet)_
```

Once the plugin is installed, load it in your Gruntfile.js like this:

```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt);
};
```

## The "grunt-config-plus" plugin

### Overview

Point to a directory where you hold all your config options:

```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt, {
        init: 'grunt/*.*',
    });
};
```

Now you can put all your task definitions in your specified folder (grunt/*.* by default).

### A task definition
A task definition is a config file in js, json or yml format. If you use js, use module.exports.

#### Task definition parameters
A task definition may consist of:

* __name__: the grunt task name and grunt config name. Derived from the name of the config file.
* __config__: `{Object}` the configuration object that you would normally feed with grunt.initConfig under property 'name'
* __description__: `{String}` description of what this task does. Displayed when running `grunt tasks`
* __execute__: `{Function|Array}` a function or array of task names that will be executed when this task is run.
* __package__: `{String}` a package the task(s) needs in order to run. What you would usually feed to grunt.loadNpmTasks
* __dependencies__: `{Array}` An array of task names this task depends on. If execute is an array of task names, it automatically appends dependencies.
* __alias__: `{Array}` one or multiple alternative task names for the task.
* __visible__: `{Boolean}` hides the task definition from the tasks list (see `grunt tasks`).

#### Task definition examples
A config file named `browserify.json`, producing the task `grunt browserify` and alias `grunt b`:
```json
{
    "description": "Continuously builds index.js into bin/js-utils.js (dev)",
    "package": "grunt-browserify",
    "config": {
        "dev": {
            "files": {
                "bin/index.js": "index.js"
            },
            "options": {
                "watch": true,
                "keepAlive": true
            }
        }
    },
    "alias": "b"
}
```

A config file named `buildBootstrap.js`, producing the task `grunt buildBootstrap` not listed by `grunt tasks`:
```js
module.exports = function(grunt, ROOT) {
    return {
        "description": "Creates custom bootstrap.js",
        "execute": function(param) {
            // entire function here
        },
        "visible": false
    }
};
```

A config file named `install.json`, producing the task `grunt install` and alias `grunt i` that run `grunt bower`, `grunt less` and `grunt buildBootstrap`:
```json
{
    "description": "Installs all project dependencies",
    "execute": ["bower", "less", "buildBootstrap"],
    "alias": "i"
}
```

### Config
The config is the optional object passed as second parameter to grunt-config-plus, next to grunt itself.

#### Config properties
The config may have the following properties:

* __init__: `{glob-path|Object}` This parameter must yield an object containing all your task definitions. Interpreter searches again for glob-paths 1 level deep in the object.
* __baseDir__: `{String}` The path prepended to any glob-path used. Defaults to the cwd of Gruntfile.js.
* __override__: `{glob-path|Object}` Pass various overrides to affect the initialization process. All objects extend/overwrite the existing objects.
 * __init__: `{Object}` Appends the init config after it has been assembled. This includes the default tasks.
 * __config__: `{Object}` Appends the grunt config (derived from the 'config' properties of all your task definitions) after it has been assembled.
 * __dependencies__: `{String|Array}` Appends the dependencies after they have been assembled. These tasks will always be loaded (not necessarily run). Pass * to load all tasks.
* __style__: `{glob-path|Object}` Customize the layout of the default tasks. Only one style property is possible. See grunt help for color styles.
 * __color__: `{String}` common style
 * __descr__: `{String}` style for descriptions only
 * __task__: `{String}` style for task names
 * __indent__: `{String}` character string used for indenting relative to the console.

Note that all results of a glob-path are automatically converted to an object, namespaced by file name.

#### Config default
```js
{
    init: 'grunt/**/*.*',
    baseDir: process.cwd(),
    style: {
        color: 'yellow',
        indent: '  ',
        descr: 'cyan',
        task: 'bold'
    }
}
```

#### Config examples
Fetches config files from directory `grunt-config` relative to `Gruntfile.js`:
```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt, {
        init: 'grunt-config/*.*'
    });
};
```

Hides all default tasks except help:
```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt, {
        override: {
            init: {
                default: { visible: false },
                view: { visible: false },
                status: { visible: false },
                tasks: { visible: false }
            }
        }
    });
};
```

Always loads all task definitions (and their dependencies and packages):
```js
module.exports = function(grunt) {
    require('grunt-config-plus')(grunt, {
        override: {
            dependencies: '*'
        }
    });
};
```

### Tools
These tasks are added by default, and will automatically be overridden if you choose to set another task under that name.

* __tasks, t__: view all available tasks
* __status__: compare package.devDependencies with the packages defined in your config files.
* __help, h__: show tips, or, with other tasks, displays the description of the tasks
* __view, v__: view an object tree containing all loaded configs, as well as grunt itself. Optional path opens the (nested) property inside that object.

## Release History
_(Nothing yet)_
