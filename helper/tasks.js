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
                style = ROOT.style,
                h = style.color,
                names,
                isVisible;

            u.white();
            u.writeln('Available tasks'[h]);
            for (var name in aliases)
            {
                names = aliases[name].slice();
                isVisible = (tasks[name].visible !== false);

                if (!isVisible)
                    continue;

                for (var i = names.length-1; i>=0; i--)
                    if (!names[i]) names.splice(i,1);

                u.writeln(1, (names.join(', ') + ":")[style.task], (tasks[name].description || '-')[style.descr]);
            }
        }
    }
};