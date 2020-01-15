export default function throttle(fn: (...args: any[]) => void, time = 300) {
    let timer: NodeJS.Timeout | null = null
    return function(...args: any[]) {
        if (timer) {
            return
        }
        timer = setTimeout(function() {
            fn.apply(this, args)
            timer = null
        }, time)
    }
}
