/**
 * Created by Nicky on 3-3-14.
 */
module.exports = function(grunt, ROOT) { return {

    getType: function(fn)
    {
        var fnStr = (fn + '').match(/^.*?$/m)[0],
            color = 'cyan';
        if (fnStr.search('function') != -1)
            color = 'grey';
        else if (fnStr == '[object Object]')
        {
            fnStr = '{}';
            color = 'white';
        }
        return fnStr[color];
    },

    writeln: function()
    {
        grunt.log.writeln(ROOT.style.indent + this._parseLog(arguments));
    },

    warn: function()
    {
        grunt.warn(ROOT.style.indent + this._parseLog(arguments));
    },

    error: function()
    {
        grunt.log.error(ROOT.style.indent + this._parseLog(arguments));
    },

    verbose: function()
    {
        grunt.verbose.writeln(ROOT.style.indent + this._parseLog(arguments));
    },

    white: function()
    {
        grunt.log.writeln('');
    },

    _parseLog: function(args)
    {
        var bullet = 0,
            bulletStr = '',
            str;

        if (grunt.util.kindOf(args[0]) == 'number')
        {
            bullet = args[0];
            Array.prototype.shift.call(args);
        }

        str = Array.prototype.join.call(args, ' ');

        bullet || (bullet = 0);

        if (bullet > 0)
        {
            bullet--;
            while (bullet--)
                bulletStr += '  ';
            bulletStr = (bulletStr + ' - ')[ROOT.style.color];
        }
        return bulletStr + str;
    },

    formatBytes: function(bytes)
    {
        var i = 0;
        while (bytes > 1024 && i<5)
        {
            bytes = bytes/1024;
            i ++;
        }
        var ext = 'bytes';
        switch (i)
        {
            case 1: ext = 'kB'; break;
            case 2: ext = 'MB'; break;
            case 3: ext = 'GB'; break;
            case 4: ext = 'TB'; break;
            case 5: ext = 'PB'; break;
        }
        return bytes.toFixed(i && 1) + ' ' + ext;
    },

    /**
     * forEach for objects.
     * @param obj
     * @param fn
     */
    forEach: function(obj, fn)
    {
        for (var name in obj)
        {
            if (!obj.hasOwnProperty(name))
                continue;

            fn(obj[name], name);
        }
    },

    mergeArray: function()
    {
        var arr = Array.prototype.concat.apply([], arguments);
        for (var i= arr.length-1; i>=0; i--)
            if (!arr[i])
                arr.splice(i,1);

        return arr;
    }


} };