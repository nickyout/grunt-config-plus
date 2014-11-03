module.exports = function(grunt, ROOT){
    return {
        "description": "Gives startup tips, or, next to one/multiple tasks, the description of a task.",
        "alias": "h",
        "visible": false,
        "execute": function()
        {
            var u = ROOT.util,
                h = ROOT.style.color;
            u.white();
            var story = [
                ['Basics:'[h]],
                [1, 'execute tasks:'[h],'grunt [task]'],
                [1, 'execute tasks with parameters:'[h], 'grunt [task]:[param1]:[param2]:[...]'],
                [''],
                ['Specific commands:'[h]],
                [1, 'grunt tasks:','list all tasks'[h]],
                [1, 'grunt view:', 'view grunt/config (dev)'[h]],
                [1, 'grunt help [task]:', 'show the description of a task'[h]],
                [''],
                ['Available log colors:'[h]]
            ];
            var i= 0, arr;
            while (arr = story[i++])
                u.writeln.apply(u, arr);

            var colorArr = ['white', 'grey', 'black', 'green', 'cyan', 'magenta', 'yellow', 'red', 'blue', 'rainbow'];
            for (i=0; i<colorArr.length; i++)
                u.writeln(1, ('.' + colorArr[i])[colorArr[i]] );
        }
    }
};
