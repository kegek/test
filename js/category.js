document.addEventListener('DOMContentLoaded', function () {
    /*区域滚动效果*/
    /*1.在父容器固定的区域内子容器来回的滑动*/
    /*2.介绍一个插件使用  iscroll.js */
    /*3.下载：https://github.com/cubiq/iscroll*/
    /*4.结构：<div><ul></ul></div> 子容器的内容尺寸大于父容器*/
    /*5.初始化*/
    new IScroll('.jd_cateLeft',{
        /*click:false*/
    });
    /*document.querySelector('.jd_cateLeft li').onclick = function () {
        console.log('ok');
    };*/

    /*左侧滚动*/
    new IScroll('.jd_cateRight', {
        scrollY: false,
        scrollX: true
    });
    /*右侧滚动*/
    /*6. 参考文档  https://www.jb51.net/article/84744.htm*/
});