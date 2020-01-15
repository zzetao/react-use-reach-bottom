import { useState, useEffect } from 'react';

function throttle(fn, time) {
    if (time === void 0) { time = 300; }
    var timer = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer) {
            return;
        }
        timer = setTimeout(function () {
            fn.apply(this, args);
            timer = null;
        }, time);
    };
}

var defaultOptions = {
    element: document.documentElement,
    throttleDelay: 200,
};
function useReachBottom(callback, options) {
    if (options === void 0) { options = defaultOptions; }
    var _a = useState(0), value = _a[0], setValue = _a[1];
    var element = options.element, throttleDelay = options.throttleDelay;
    useEffect(function () {
        var handleScroll = throttle(function (e) {
            var el = getElement(element || document.documentElement);
            if (el) {
                var scrollTop = el.scrollTop, scrollHeight = el.scrollHeight, clientHeight = el.clientHeight;
                var val = (scrollTop + clientHeight) / scrollHeight;
                callback && callback(val, e);
                setValue(val);
            }
        }, throttleDelay || 200);
        getListener(element).addEventListener('scroll', handleScroll);
        return function () {
            getListener(element).removeEventListener('scroll', handleScroll);
        };
    }, [element]);
    return value;
}
function getElement(ref) {
    if (!(ref instanceof HTMLElement)) {
        return ref.current;
    }
    return ref;
}
function getListener(ref) {
    if (!ref || ref === document.documentElement || ref === document.body) {
        return window;
    }
    if (!(ref instanceof HTMLElement)) {
        return ref.current || window;
    }
    return ref;
}

export default useReachBottom;
//# sourceMappingURL=index.es.js.map
