module.exports = function(grunt, ROOT){
    return {
        "description": "View grunt or package.json. Use 'grunt view:grunt.[prop].[nest].[etc].'",
        "alias": "v",
        "execute": function()
        {
            var tg = ROOT,
                h = ROOT.style.color,
                u = ROOT.util,
                str = '[ROOT]',
                args = Array.prototype.slice.call(arguments),
                name;

            if (args.length == 1)
                args = args[0].split('.');

            if (args.length > 0)
                str = '';

            while (args.length > 0)
            {
                name = args.shift();
                str += (str && '.') + name;
                tg = tg[name];
            }

            u.white();
            u.writeln('Properties of '[h] + str + ':'[h]);

            for (name in tg)
            {
                var fnStr = (tg[name] + '').match(/^.*?$/m)[0],
                    color = 'cyan';
                if (fnStr.search('function') != -1)
                    color = 'grey';
                else if (fnStr == '[object Object]')
                {
                    fnStr = '{}';
                    color = 'white';
                }
                u.writeln(1, name + ':', fnStr[color]);
            }
        }
    }
};