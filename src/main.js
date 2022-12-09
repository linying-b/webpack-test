import count from "./js/count";
import sum from "./js/sum";
import { mul } from "./js/math"
import "./css/iconfont.css"
import "./css/index.css"
import "./less/a.less"
import "./sass/test1.sass"
import "./sass/test2.scss"
import "./stylus/index.styl"

const result = count(6, 2);
console.log(result)
console.log(count(4, 7));
console.log(sum(1, 2, 3, 4))
console.log(mul(3, 5));

if (module.hot) {
    module.hot.accept("./js/count")
}