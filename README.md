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

A task definition may consist of:

* __name__: the file name
* __config__: the stuff you would feed to grunt.initConfig under property 'name'
* __description__: displayed in relation to your tasks
* __execute__: a function or array of task names to register as the task.
* __package__: a package the tasks requires to run. What you would usually feed to grunt.loadNpmTasks
* __dependencies__: a list of task names this task depends on. If execute is an array, appends this automatically.
* __alias__: alternative names for the tasks.
* __visible__: hides the task definition from the tasks list (see `grunt tasks`).

### Options

#### Init config options:

All properties:
```js
{
    init: {glob-path|Object} searches again for glob-paths 1 level deep
    style: {glob-path|Object} {
        color: {String} common console output color see nodejs/grunt log colors
        descr: {String} color property, for descriptions only
        task: {String} color property, for task names only
    }
    override: {glob-path|Object} {
        init: {Object}, Appends the resulting init object with this. Nested objects are possible.
        config: {Object}, Appends the resulting grunt config with this. Nested objects are possible.
        dependencies: {Array} These task names are always loaded. Pass * to load all tasks.
    }
}
```


#### Task options

All properties:

```js
{
    description: {String}
    config: {Object}
    execute: {Function|Array}
    alias: {String|Array}
    package: {String}
    dependencies: {Array}
}
```

### Tools
These tasks are added by default, and will automatically be overridden if you choose to set another task under that name.

* __tasks, t__: view all available tasks
* __status__: compare package.devDependencies with the packages defined in your config files.
* __help, h__: show tips, or, with other tasks, displays the description of the tasks
* __view, v__: view an object tree containing all loaded configs, as well as grunt itself. Optional path opens the (nested) property inside that object.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
