import {MPW} from "./mp";

const template = ['phrase', 'name', 'pin', 'short', 'basic', 'medium', 'long', 'maximum'];

let mpw;
onmessage = function (message) {
    let data = message.data;
    if (data.checked === 0) {
        mpw = new MPW(data.name, data.pw);
    } else {
        mpw.generate(data.site, data.count, template[data.templateIndex - 1]).then(res => {
            data.result = res;
            postMessage(data);
        })
    }
};