/**
 * Created by 断崖 on 2016/9/5.
 */

//JS函数重载模拟
(function () {
    function Overload(fn_objs) {
        var is_match = function (x, y) {
            if (x == y) return true;

            if (x.indexOf("*") == -1) return false;

            var x_arr = x.split(","),
                y_arr = y.split(",");
            if (x_arr.length != y_arr.length) return false;

            while (x_arr.length) {
                var x_first = x_arr.shift(),
                    y_first = y_arr.shift();
                if (x_first != "*" && x_first != y_first) return false;
            }
            return true;
        };
        var ret = function () {
            var args = arguments,
                args_len = args.length,
                args_types = [],
                args_type,
                fn_objs = args.callee._fn_objs,
                match_fn = function () {
                };

            for (var i = 0; i < args_len; i++) {
                var type = typeof args[i];
                type == "object" && (args[i].length > -1) && (type = "array");
                args_types.push(type);
            }
            args_type = args_types.join(",");
            for (var k in fn_objs) {
                if (is_match(k, args_type)) {
                    match_fn = fn_objs[k];
                    break;
                }
            }
            return match_fn.apply(this, args);
        };
        ret._fn_objs = fn_objs;
        return ret;
    }

    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return Overload;
        });
    } else {
        window.Overload = Overload;
    }
})();
