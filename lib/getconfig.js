module.exports = function(grunt, ROOT) { return {

    path: require('path'),

    getConfig: function(globOrObject, recurseLvl, rootName, internal)
    {
        rootName || (rootName = 'base');
        var returnConfig,
            thisConfig,
            configs = [],
            h = ROOT.style.color,
            self = this,
            path = this.path;

        ROOT.util.verboseln('checking'[h], rootName + ':', (globOrObject + '').grey);

        switch (grunt.util.kindOf(globOrObject))
        {
            // Could be glob path...
            case "array":
            case "string":
                grunt.file.expand({ filter: 'isFile' }, globOrObject).forEach(function(filePath)
                {
                    if (!internal)
                        filePath = path.join(ROOT.baseDir,filePath);

                    ROOT.util.verboseln(1, filePath);
                    thisConfig = self.readConfigFile(filePath);
                    if (thisConfig && thisConfig.out)
                        configs.push(thisConfig);
                });

                // Single config or multiple?
                if (configs.length == 1)
                    returnConfig = configs[0].out;
                else
                {
                    returnConfig = {};
                    configs.forEach(function(configDef){
                        returnConfig[configDef.name] = configDef.out;
                    });
                }
                break;

            case "object":
                returnConfig = globOrObject;
                break;
        }

        // Check for paths recursively
        if (returnConfig && recurseLvl > 0)
        {
            ROOT.util.forEach(returnConfig, function(obj, name)
            {
                var c = self.getConfig(obj, recurseLvl - 1, rootName + '.' + name);
                if (c)
                    returnConfig[name] = c;
            })
        }
        return returnConfig;
    },

    readConfigFile: function(filePath)
    {
        var path = this.path,
            ext = path.extname(filePath),
            name = path.basename(filePath, ext),
            out, i;

        // reading file
        switch (ext)
        {
            case ".js":
                out = require(filePath);
                if (grunt.util.kindOf(out) == "function")
                    out = out(grunt, ROOT);
                break;

            case ".json":
                out = grunt.file.readJSON(filePath);
                break;

            case ".yml":
            case ".yaml":
                out = grunt.file.readYAML(filePath);
                break;
        }
        return {name: name, out: out};
    },

    overrideConfig: function(source, dest, destLabel)
    {
        var h = ROOT.style.color;
        if (source)
            for (var name in source)
            {
                if (!source.hasOwnProperty(name))
                    continue;

                if (dest[name])
                {
                    destLabel && ROOT.util.writeln('Overriding: '[h] + destLabel + '.' + name + ' ...'[h]);
                    if (grunt.util.kindOf(dest[name]) == "object" && grunt.util.kindOf(source[name]) == "object")
                    {
                        overrideConfig(source[name], dest[name], destLabel && (destLabel + '.' + name));
                        continue;
                    }
                }

                dest[name] = source[name];
            }
        return dest;
    }


}};