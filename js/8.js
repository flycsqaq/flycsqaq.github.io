(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{396:function(n,e){n.exports='<h1 id="随机数生成">随机数生成</h1>\n<p>本文从 Math.random()出发,逐步分析如何生成一个随机非负整数 y, y∈[min, max],以及如何批量生成随机数并对它们作出某些限制.</p>\n<h2 id="1-生成随机数-y-y∈min-max">1. 生成随机数 y, y∈[min, max]</h2>\n<h3 id="11-生成随机数-x">1.1 生成随机数 x</h3>\n<p>通过<code>const x = Math.random()</code>获得 x,x∈[0, 1);</p>\n<h3 id="12-分析步骤">1.2 分析步骤</h3>\n<p>通过观察可知,从 x 变化到 y 大概需要如下几个步骤：</p>\n<ol>\n<li>最终结果: [0, 1) =&gt; [min, max]</li>\n<li>放大倍数(max - min) / 1 - 0: [0, 1) =&gt; [0, max -min)</li>\n<li>+min: [0, max - min] =&gt; [min, max)</li>\n<li>小数转整数, Math.ceil(): [min, max) =&gt; [min, max] //很难得到 min</li>\n</ol>\n<h3 id="13-代码">1.3 代码</h3>\n<pre><code>const createNonnegativeInteger = (min, max) =&gt; {\n    return Math.ceil(Math.random * (max - min) + min)\n}</code></pre><h3 id="14-问题">1.4 问题</h3>\n<p>这样做在有一定的问题,即 min 只有在 x=0 时才取到,为了使 y 在[min, max]的概率均匀分布,需要进行一些处理.需要通过 Math.floor()向下取整.对[min, max+1)向下取整可以得到均匀分布的[min, max].</p>\n<ol>\n<li>(max - min + 1) / 1 - 0: [0, 1) = [0, max - min + 1)</li>\n<li>+min: =&gt; [min, max + 1)</li>\n<li>Math.floor: =&gt; [min, max]</li>\n</ol>\n<h3 id="15-最终代码">1.5 最终代码</h3>\n<pre><code>const createNonnegativeInteger = (min, max) =&gt; {\n    return Math.floor(Math.random * (max - min + 1) + min)\n}</code></pre><h2 id="2-批量生成随机数">2. 批量生成随机数</h2>\n<h3 id="21-只是批量生成">2.1 只是批量生成</h3>\n<pre><code>const batchGenerator = (arr = [], {min, max, counter}) = {\n    const createSingle = createNonnegativeInteger.bind(null, min, max)\n    for (let i = 0; i &lt; counter; i++) {\n        arr.push(createSingle())\n    }\n    return arr\n}</code></pre><h3 id="22-对数组的操作">2.2 对数组的操作</h3>\n<p>如果想对批量生成的数组做点什么呢?比如去重、删除出现次数最多的数字?停一下,事实上,我们做的是将批量生成的数组交给下一个函数进行操作.即<code>nextFn()</code>,或许我们可以通过职责链模式来进行处理.</p>\n<pre><code>class DutyChain {\n    constructor({execute = null, next = null}) {\n        this.execute = execute\n        this.next = next\n    }\n    // 对数据进行处理,并将处理后的结果交给下一位\n    delivery(data, ...args) {\n        let value = data\n        if (typeof this.execute === &#39;function) {\n            value = this.execute(value, ...args) // 处理数据\n        }\n        if (this.next instanceof DutyChain &amp;&amp; typeof this.next.execute === &#39;function&#39;) {\n            return this.next.execute(value, ...args)  // 将数据交给下一位\n        }\n        return value\n    }\n}</code></pre><h3 id="23-数组去重">2.3 数组去重</h3>\n<pre><code>const unique = (arr) =&gt; {\n    return Array.from(new Set(arr))\n}\n\nconst uniqueAndReplenish = (arr, {min, max, counter}) {\n    let array = unique(arr)\n    const createSingle = getRandomNum.bind(null, min, max)\n    while (array.length &lt; counter) {\n        const num = createSingle()\n        // 判断数组中是否存在该数字\n        if (array.indexOf(num) === -1) {\n            array.push(num)\n        }\n    }\n    return array\n}</code></pre><h3 id="24-连接函数">2.4 连接函数</h3>\n<pre><code>const removeDuplicates = new DutyChain({ execute: uniqueAndReplenish, next: null });\nconst batch = new DutyChain({ execute: getBatchRandomNum, next: removeDuplicates });\nbatch.delivery([], { min, max, counter }) // 批量生成不重复的随机数</code></pre>'},397:function(n,e){n.exports="<pre><code>/**\n * 获取一个[min, max]的随机数\n * @param {number} min\n * @param {number} max\n * @returns {number} 范围在[min, max]的随机数\n */\nconst getRandomNum = (min: number, max: number): number =&gt; {\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n};\n\ninterface RandomPayload {\n    min: number;\n    max: number;\n    counter: number;\n}\n\n/**\n * 批量获取随机数\n * @param {number[]} arr\n * @param {RandomPayload} { min, max, counter}\n * @returns {number[]} 数量为counter,范围在[min, max]的随机数数组\n */\nexport const getBatchRandomNum = (arr: number[] = [], { min, max, counter }: RandomPayload): number[] =&gt; {\n    const array = arr.slice();\n    const createSingle = getRandomNum.bind(null, min, max);\n    for (let i = 0; i &lt; counter; i++) {\n        array.push(createSingle());\n    }\n    return array;\n};\n\n/**\n * 数组去重\n * @param {number[]} arr\n * @returns {number[]}\n */\nconst unique = (arr: number[]): number[] =&gt; {\n    return Array.from(new Set(arr));\n};\n\n/**\n * 数组去重并补充至原长度\n * @param {number[]} arr\n * @param {RandomPayload} { min, max, counter}\n * @returns {number[]}  数量为counter,范围在[min, max]的无重复项随机数数组\n */\nexport const uniqueAndReplenish = (arr: number[], { min, max, counter }: RandomPayload): number[] =&gt; {\n    const array: number[] = unique(arr);\n    const createSingle = getRandomNum.bind(null, min, max);\n    while (array.length &lt; counter) {\n        const num = createSingle();\n        if (array.indexOf(num) === -1) {\n            array.push(num);\n        }\n    }\n    return array;\n};\n\nexport type Execute = &lt;T&gt;(d: T, ...args: any[]) =&gt; T;\n\ninterface DutyChainPayload {\n    execute: Execute | null;\n    next: DutyChain | null;\n}\n/**\n * @class 职责链模式与命令模式结合\n * @demo\n * const duty1 = new DutyChain({execute: callback1})\n * const duty2 = new DutyChain({execute: callback2, next: duty1})\n * duty2.delivery(...args)\n */\nexport class DutyChain {\n    public execute: Execute | null;\n    public next: DutyChain | null;\n    public constructor({ execute = null, next = null }: DutyChainPayload) {\n        this.execute = execute;\n        this.next = next;\n    }\n    /**\n     * 命令模式,调用next.execute(...args)\n     * @param {T} d\n     * @param {Array} args 传递的参数\n     * @returns {T} 链式处理后的值\n     */\n    public delivery&lt;T&gt;(d: T, ...args: any[]): T {\n        let value = d;\n        if (typeof this.execute === &#39;function&#39;) {\n            value = this.execute(value, ...args);\n        }\n        if (this.next instanceof DutyChain &amp;&amp; typeof this.next.execute === &#39;function&#39;) {\n            return this.next.execute(value, ...args);\n        }\n        return value;\n    }\n}\n\n/**\n * demo\n */\nconst removeDuplicates = new DutyChain({ execute: uniqueAndReplenish, next: null });\nconst batch = new DutyChain({ execute: getBatchRandomNum, next: removeDuplicates });\n\nbatch.delivery([], {0, 100, 10})</code></pre>"},648:function(n,e,t){"use strict";t.r(e);var a=t(1),r=t.n(a),i=t(250),u=t.n(i),l=(t(249),t(615)),o=t.n(l),m=(t(281),t(80)),c=t.n(m),x=(t(89),t(611)),d=t.n(x),s=(t(286),t(612)),h=t.n(s),p=(t(288),t(602)),y=t.n(p),f=(t(290),t(229)),b=t.n(f),g=(t(227),0),v=function(n){return u.a.create({name:"form"+ ++g})(n)},w=function(n,e){var t="function"==typeof Symbol&&n[Symbol.iterator];if(!t)return n;var a,r,i=t.call(n),u=[];try{for(;(void 0===e||e-- >0)&&!(a=i.next()).done;)u.push(a.value)}catch(n){r={error:n}}finally{try{a&&!a.done&&(t=i.return)&&t.call(i)}finally{if(r)throw r.error}}return u},E=function(){for(var n=[],e=0;e<arguments.length;e++)n=n.concat(w(arguments[e]));return n},D=function(n,e){return Math.floor(Math.random()*(e-n+1))+n},S=function(n,e){void 0===n&&(n=[]);for(var t=e.min,a=e.max,r=e.counter,i=n.slice(),u=D.bind(null,t,a),l=0;l<r;l++)i.push(u());return i},C=function(n,e){for(var t=e.min,a=e.max,r=e.counter,i=function(n){return Array.from(new Set(n))}(n),u=D.bind(null,t,a);i.length<r;){var l=u();-1===i.indexOf(l)&&i.push(l)}return i},R=function(){function n(n){var e=n.execute,t=void 0===e?null:e,a=n.next,r=void 0===a?null:a;this.execute=t,this.next=r}return n.prototype.delivery=function(e){for(var t,a=[],r=1;r<arguments.length;r++)a[r-1]=arguments[r];var i=e;return"function"==typeof this.execute&&(i=this.execute.apply(this,E([i],a))),this.next instanceof n&&"function"==typeof this.next.execute?(t=this.next).execute.apply(t,E([i],a)):i},n}(),M=t(33),T=t(396),A=t.n(T),k=t(397),q=t.n(k),N=t(237),P=function(){return(P=Object.assign||function(n){for(var e,t=1,a=arguments.length;t<a;t++)for(var r in e=arguments[t])Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}).apply(this,arguments)},O=function(n,e){var t="function"==typeof Symbol&&n[Symbol.iterator];if(!t)return n;var a,r,i=t.call(n),u=[];try{for(;(void 0===e||e-- >0)&&!(a=i.next()).done;)u.push(a.value)}catch(n){r={error:n}}finally{try{a&&!a.done&&(t=i.return)&&t.call(i)}finally{if(r)throw r.error}}return u};e.default=v(function(n){var e=[{label:"最小值(min)",value:0,tag:"min",validator:function(e,t,a){var r=n.form.getFieldsValue();r.max<=r.min?a("min无法大于min"):a()}},{label:"最大值(max)",value:100,tag:"max",validator:function(e,t,a){var r=n.form.getFieldsValue();r.max<=r.min?a("max无法小于min"):a()}},{label:"随机数数量(counter)",value:10,tag:"counter",validator:function(e,t,a){var r=n.form.getFieldsValue(),i=r.max,u=r.min,l=r.unique,o=r.counter;!l&&i-u<o?a("在非重复模式下,请保证max - min >= counter"):a()}}],t=O(Object(a.useState)([]),2),i=t[0],l=t[1],m=new R({execute:C,next:null}),x=new R({execute:S,next:null}),s=O(Object(a.useState)(!0),2),p=s[0],f=s[1],g=n.form.getFieldDecorator,v=O(Object(a.useState)(!0),2);v[0],v[1];return r.a.createElement(b.a,{defaultActiveKey:"a"},r.a.createElement(b.a.TabPane,{key:"a",tab:"工具"},r.a.createElement(y.a,null,r.a.createElement(y.a.Title,{level:2,style:{textAlign:"center"}},"随机数生成")),r.a.createElement(u.a,P({onSubmit:function(e){return function(e){e.preventDefault(),n.form.validateFieldsAndScroll(function(n,e){var t=e.max,a=e.min,r=e.counter,i=e.unique;n||(x.next=i?null:m,l(x.delivery([],{min:a,max:t,counter:r})))})}(e)}},{labelCol:{sm:{span:4},md:{span:6}},wrapperCol:{sm:{span:24},md:{span:16}}}),e.map(function(n,e){return r.a.createElement(u.a.Item,{key:e,label:n.label},g(n.tag,{rules:[{validator:n.validator,type:"number"}],initialValue:n.value})(r.a.createElement(d.a,{style:{width:"100%"}})))}),r.a.createElement(u.a.Item,{key:"switch",label:"能否重复"},g("unique",{initialValue:!1})(r.a.createElement(h.a,null))),r.a.createElement("div",{className:M.center},r.a.createElement(c.a,{htmlType:"submit"},"随机数生成"))),r.a.createElement(c.a,{onClick:function(){return function(){if(0!==i.length){var n=p,e=i.slice().sort(function(e,t){return n?e-t:t-e});f(!p),l(e)}}()}},"排序"),r.a.createElement(o.a,{title:"随机数"},i.map(function(n,e){return r.a.createElement(o.a.Grid,{key:e,style:{textAlign:"center",width:"20%"}},n)}))),r.a.createElement(b.a.TabPane,{forceRender:!1,key:"b",tab:"代码分析"},r.a.createElement(N.a,{name:"random",md:A.a})),r.a.createElement(b.a.TabPane,{forceRender:!1,key:"c",tab:"代码"},r.a.createElement(N.a,{name:"randomCode",md:q.a})))})}}]);