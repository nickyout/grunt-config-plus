module.exports = function(grunt, ROOT)
{
    return {
        "description": "Checks missing/redundant grunt packages in package.json",
        /**
         * Shows registered vs used devDependencies.
         */
        "execute": function()
        {
            var u = ROOT.util,
                h = ROOT.style.color;

            u.white();
            var reqPackages = [],
                devPackages = [],
                filterFunc = function(obj){
                    return (this.indexOf(obj) == -1);
                },
                displayFunc = function(name){
                    u.writeln(1, name[this.color]);
                };

            u.verbose('Required:'[h]);
            u.forEach(ROOT.init, function(obj)
            {
                if (obj.package && reqPackages.indexOf(obj.package) == -1)
                {
                    reqPackages.push(obj.package);
                    u.verbose(1, obj.package);
                }
            });
            u.verbose('');

            u.verbose('In devDependencies:'[h]);
            u.forEach(ROOT.package.devDependencies, function(obj, name)
            {
                if (devPackages.indexOf(name) == -1)
                {
                    devPackages.push(name);
                    u.verbose(1, name);
                }
            });
            u.verbose('');
            var reqDiff = reqPackages.filter(filterFunc.bind(devPackages)),
                devDiff = devPackages.filter(filterFunc.bind(reqPackages)).filter(function(name) { return name.search('grunt-') != -1 });

            if (reqDiff.length != 0 || devDiff.length != 0)
            {
                if (devDiff.length > 0)
                {
                    u.writeln('Rendundant packages:'[h]);
                    devDiff.forEach(displayFunc.bind({color: 'green'}));
                    u.white();
                }
                if (reqDiff.length > 0)
                {
                    u.writeln('Missing packages:'[h]);
                    reqDiff.forEach(displayFunc.bind({color: 'red'}));
                }
            }
            else
            {
                u.writeln('All packages in use.'[h]);
            }

        }
    }
};