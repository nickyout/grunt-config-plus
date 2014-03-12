module.exports = function(grunt, ROOT)
{
    return {
        "description": "List all available tasks",
        "alias": "t",
        "execute": function()
        {
            var aliases = ROOT.alias,
                tasks = ROOT.init,
                u = ROOT.util,
                h = ROOT.style.color,
                names;

            u.white();
            u.writeln('Available tasks'[h]);
            for (var name in aliases)
            {
                if (tasks[name].visible === false)
                    continue;

                names = aliases[name].slice();
                for (var i = names.length-1; i>=0; i--)
                    if (!names[i]) names.splice(i,1);

                u.writeln(1, names.join(', ') + ':', (tasks[name].description || '-').cyan);
            }
        }
    }
};