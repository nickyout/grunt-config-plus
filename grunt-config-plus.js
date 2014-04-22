module.exports = function(grunt, options)
{
    options || (options = {});
    var initDefinition = options.init || 'grunt/**/*.*',
        overrideStyle = options.style,
        overrideDefinitions = options.override || {},
        baseDir = options.baseDir || process.cwd();

    var path = require('path'),
        ROOT = {
            baseDir: baseDir,
            style: {
                color: 'yellow',
                indent: '  ',
                descr: 'cyan',
                task: 'bold'
            },
            grunt: grunt,
            package: grunt.file.readJSON('package.json'),
            init: {},
            config: {},
            alias: {}
        },
        u = ROOT.util = require('./lib/utils.js')(grunt, ROOT),
        gc = require('./lib/getconfig.js')(grunt, ROOT);

    // Read custom first for styling
    overrideDefinitions = gc.getConfig(overrideDefinitions, 0, 'overrides', false);

    overrideStyle = gc.getConfig(overrideStyle, 0, 'style', false);

    // Define styling
    var style = gc.overrideConfig(overrideStyle, ROOT.style, null),
        h = style.color;

    // Define all ROOT properties

    var duplicateDef = {
        duplicates: {},
        duplicateCount: 0
    };

    addToInit( path.join(__dirname,'helper/*.*'), true);

    // Add default tasks
    addInitConfig("default", {
        "description": "Runs 'tasks'.",
        "execute": ["tasks"]
    });

    // User defined tasks override defaults
    addToInit(initDefinition);

    // Track & warn all duplicates, but allow --force
    var duplicateCount = duplicateDef.duplicateCount,
        duplicates = duplicateDef.duplicates;

    if (duplicateCount > 0)
    {
        u.writeln('');
        var warnStr = 'found '[h] + duplicateCount + ' duplicate name(s) or alias(es) found in config files:\n'[h];
        for (var prop in duplicates)
        {
            if (!duplicates[prop] || duplicates[prop].length < 2)
                continue;

            warnStr += ' - '[h] + prop + ' by '[h] + duplicates[prop].join(', ') + '\n';
        }
        u.warn(warnStr);
    }

    // custom.init will override user and defaults
    gc.overrideConfig(overrideDefinitions.init, ROOT.init, 'ROOT.init');

    // Add all possible dependencies
    var customDeps = u.mergeArray(overrideDefinitions.dependencies);
    if (customDeps.indexOf("*") != -1)
        for (var name in ROOT.alias)
            if (ROOT.alias.hasOwnProperty(name))
                customDeps.push(name);


    var allTasks = u.mergeArray(grunt.cli.tasks, "default"),
        bootDef = createBootDef(ROOT, allTasks);

    // Custom config overrides user and defaults
    gc.overrideConfig(overrideDefinitions.config, bootDef.config, 'gruntConfig');

    // The help case
    if (bootDef.helpOnly)
    {
        for (var i= 0; i< allTasks.length; i++)
        {
            if (!allTasks[i])
                continue;
            var taskName = allTasks[i].split(':')[0];
            if (ROOT.init[taskName])
                grunt.registerTask(taskName, showInfo.bind(this, taskName, ROOT.init[taskName]));
        }
        return;
    }

    initDependencies(ROOT, bootDef);

    // Done, execute tasks...

    //////////////////////////////////////////////////////////////
    // Init functions
    //////////////////////////////////////////////////////////////


    function addToInit(initConfigDef, internal)
    {
        var config = gc.getConfig(initConfigDef, 1, 'init', internal);

        if (!config)
            u.warn('Could not define any init config from'[h], initConfigDef);

        // Add all as init.
        u.forEach(config, function(obj, name)
        {
            addInitConfig(name, obj);
        });
    }

    function addInitConfig(name, out)
    {
        // Setting aliases
        var aliases = u.mergeArray(name, out.alias),
            alias;
        for (i=0; i<aliases.length; i++)
        {
            alias = aliases[i];
            if (!alias)
                continue;
            if (ROOT.init[alias])
            {
                // Override found
                duplicateDef.duplicateCount ++;
            }
            (duplicateDef.duplicates[alias] || (duplicateDef.duplicates[alias] = [])).push(name);
            ROOT.init[alias] = out;
        }
        ROOT.alias[name] = aliases;
    }

    function createBootDef(ROOT, allTasks)
    {
        var helpOnly = (allTasks.filter(function(val){
                return (u.mergeArray(ROOT.alias['help']).indexOf(val) != -1);
            }).length > 0 && allTasks.length > 2);

        var bootDef = {
                tasks: {},
                config: { pkg: ROOT.package },
                npmTasks: [],
                helpOnly: helpOnly
            },
            registered = [],
            i;

        if (!helpOnly)
        {
            for (i= 0; i< allTasks.length; i++)
                registerFromConfig(ROOT, allTasks[i].split(':')[0], bootDef, registered);

        }

        return bootDef;

    }

    /**
     * Subroutine. Collect references/definitions to all things needed to run task(s)
     * @param ROOT
     * @param name
     * @param bootDef
     * @param registered
     */
    function registerFromConfig(ROOT, name, bootDef, registered)
    {
        var actualDevDep = ROOT.package.devDependencies || {},
            grunt = ROOT.grunt;

        if (!ROOT.init[name]  || registered.indexOf(name) != -1)
            return;

        var c = ROOT.init[name],
            dependencies = c.dependencies || [],
            config = c.config,
            packageName = c.package,
            execute = c.execute,
            descr = c.description;

        // Prevent circular referencing
        registered.push(name);

        //register task under name if fn (+ descr) is set
        if (execute && !bootDef.tasks[name])
        {
            var arr;
            if (grunt.util.kindOf(execute) == "function")
                arr = [name, execute];
            else
            {
                dependencies.push.apply(dependencies, execute);
                arr = [name, execute];
            }

            descr && arr.splice(1,0,descr);
            bootDef.tasks[name] = arr;
        }

        if (dependencies)
        {
            var i = 0, depName;
            while (depName = dependencies[i++])
                registerFromConfig(ROOT, depName.split(':')[0], bootDef, registered);
        }

        if (packageName && bootDef.npmTasks.indexOf(packageName) == -1)
        {
            if (!(packageName in actualDevDep))
                u.error('Package '[h] + packageName + ' not found among devDependencies in '[h] + 'package.json' + '.'[h]);
            bootDef.npmTasks.push(packageName);
        }

        // If config and name are set, add config for init
        if (config && !bootDef.config[name])
            bootDef.config[name] = config;
    }

    /**
     * Boot everything needed to run tasks
     * @param ROOT
     * @param obj
     */
    function initDependencies(ROOT, obj)
    {
        var tasksToRegister = obj.tasks,
            grunt = ROOT.grunt,
            i, name, el;

        // Register all functions
        for (name in tasksToRegister)
            if (tasksToRegister.hasOwnProperty(name))
                grunt.registerTask.apply(grunt.registerTask, tasksToRegister[name]);

        i = 0;
        while (el = obj.npmTasks[i++])
            grunt.loadNpmTasks(el);

        ROOT.config = obj.config;
        grunt.initConfig(obj.config);
    }

    /**
     * Override function for helpOnly
     * @param taskName
     * @param taskDef
     */
    function showInfo(taskName, taskDef)
    {
        if (ROOT.alias['help'].indexOf(taskName) != -1)
            return;
        u.white();
        var description = taskDef.description || 'No description available';
        u.writeln(taskName[style.task] + ':', description[style.descr]);
    }

};
