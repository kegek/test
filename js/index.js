/*1.移动端不建议使用jquery*/
/*1.1 jquery的库资源体积大  80kb */
/*1.2 做了IE版本浏览器的兼容 */
/*1.3 使用H5原生的API就可以解决一些常见问题*/
/*1.4 可以使用像 zepto.js 这样的库*/

/*具体：顶部搜索 轮播图  倒计时*/
//window.onload = function(){}; //等所有资源加载完毕
//等html结构加载完毕事件
document.addEventListener('DOMContentLoaded', function () {
    /*顶部搜索*/
    new Search();
    /*轮播图*/
    new Banner();
    /*倒计时*/
    new DownTime();
});
/*1.默认背景颜色完全透明*/
/*2.当页面滚动的时候  透明度逐渐变大*/
/*3.当页面滚动出轮播图  透明度保持不变*/
var Search = function () {
    this.el = document.querySelector('.jd_search_box');
    this.banner = document.querySelector('.jd_banner');
    this.max = 0.85;
    this.init();
};
Search.prototype.init = function () {
    var _this = this;
    /*直接实现*/
    _this.el.style.backgroundColor = 'rgba(216,80,92,0)';
    window.onscroll = function () {
        /*不断的去计算滚动的位置和轮播图高度的关系*/
        //卷曲的高度
        var scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
        //轮播图的高度
        var height = _this.banner.offsetHeight;
        /*计算透明度*/
        var opacity = 0;
        if (scrollTop <= height) {
            opacity = scrollTop / height * _this.max;
        } else {
            opacity = _this.max;
        }
        //设置透明度
        _this.el.style.backgroundColor = 'rgba(216,80,92,' + opacity + ')';
    }
};

/*轮播图*/
/*1. 自动轮播图  定时器+位移+过渡*/
/*2. 点对应图片改变 判断当前索引去选中 */
/*3. 图片滑动功能 监听移动端滑动事件去操作图片的位移 */
/*4. 当滑动的距离不够大  吸附效果 */
/*5. 当滑动的距离够大  切换图片 上一张 下一张*/
/*6. 当滑动的速度超出了你的感觉比较快的体感速度  切换图片 上一张 下一张*/
var Banner = function () {
    /*属性*/
    //轮播图容器
    this.el = document.querySelector('.jd_banner');
    //一张图片的宽度
    this.width = this.el.offsetWidth;
    //图片容器
    this.imageBox = this.el.querySelector('ul:first-child');
    //点容器
    this.pointBox = this.el.querySelector('ul:last-child');
    //当前索引
    this.index = 1;
    //定时器
    this.timer = null;
    //调用入口
    this.init();
};
//入口函数
Banner.prototype.init = function () {
    this.autoPlay();
    this.imageSwipe();
};
//自动轮播  无缝轮播 无缝滑动功能
Banner.prototype.autoPlay = function () {
    var _this = this;
    //开启定时器
    _this.setTimer();
    /*当索引为9且动画执行完毕之后瞬间定位到索引为1的图片*/
    _this.imageBox.addEventListener('transitionend', function () {
        if (_this.index >= 9) {
            _this.index = 1;
            //根据索引瞬间定位
            //去除过渡
            _this.delTransition();
            //做位移
            _this.setTranslateX(-_this.index * _this.width);
        } else if (_this.index <= 0) {
            _this.index = 8;
            //根据索引瞬间定位
            //去除过渡
            _this.delTransition();
            //做位移
            _this.setTranslateX(-_this.index * _this.width);
        }

        /*设置点*/
        //索引取值范围是什么？ 1-8
        //对应点 0-7 点索引
        _this.setPoint();
    });
};
/*点改变*/
Banner.prototype.setPoint = function () {
    /*1.去掉之前的选中效果*/
    this.pointBox.querySelector('li.now').classList.remove('now');
    /*2.给当前的加上选中效果*/
    this.pointBox.querySelectorAll('li')[this.index - 1].classList.add('now');
};
/*图片滑动功能*/
Banner.prototype.imageSwipe = function () {
    var _this = this;
    //记录起始的触摸点坐标X
    var startX = 0;
    var distance = 0;
    var time = 0;
    this.imageBox.addEventListener('touchstart', function (e) {
        //关闭定时器
        clearInterval(_this.timer);
        //记录起始的触摸点坐标X
        startX = e.touches[0].clientX;
        //记录当前时间
        time = Date.now();
    });
    this.imageBox.addEventListener('touchmove', function (e) {
        //记录移动的触摸点坐标X
        var moveX = e.touches[0].clientX;
        //计算位置的改变
        distance = moveX - startX;
        //计算图片容器应该设置的位置 = 原理的位置  + 位置的改变
        var translateX = -_this.index * _this.width + distance;
        _this.delTransition();
        //即时的改变
        _this.setTranslateX(translateX);
    });
    this.imageBox.addEventListener('touchend', function (e) {
        /*6. 手速切换*/
        /*6.1 v = s / t  手速 = 移动的距离/滑动的时间 */
        var s = Math.abs(distance); //单位 px
        var t = Date.now() - time;  //单位 ms
        var v = s / t ;//每ms多少px;
        //console.log(v);//体感 0.3
        if(v > 0.3){
            /*5. 切换*/
            if (distance > 0) {
                /*右滑 上一张*/
                _this.index--;
            } else {
                /*左滑 下一张*/
                _this.index++;
            }
            _this.addTransition();
            _this.setTranslateX(-_this.index * _this.width);
        }else{
            /*去判断滑动的距离  三分之一的屏幕宽度*/
            if (Math.abs(distance) < _this.width / 3) {
                /*4. 吸附*/
                _this.addTransition();
                _this.setTranslateX(-_this.index * _this.width);
            } else {
                /*5. 切换*/
                if (distance > 0) {
                    /*右滑 上一张*/
                    _this.index--;
                } else {
                    /*左滑 下一张*/
                    _this.index++;
                }
                _this.addTransition();
                _this.setTranslateX(-_this.index * _this.width);
            }
        }

        //重新开始定时器
        _this.setTimer();
    });
};
//加过渡
Banner.prototype.addTransition = function () {
    this.imageBox.style.transition = 'all 0.3s';
    this.imageBox.style.webkitTransition = 'all 0.3s';
};
//去过渡
Banner.prototype.delTransition = function () {
    this.imageBox.style.transition = 'none';
    this.imageBox.style.webkitTransition = 'none';
};
//做位移
Banner.prototype.setTranslateX = function (translateX) {
    this.imageBox.style.transform = 'translateX(' + translateX + 'px)';
    this.imageBox.style.webkitTransform = 'translateX(' + translateX + 'px)';
};
//设置定时器
Banner.prototype.setTimer = function () {
    var _this = this;
    //严谨考虑 加定时器之前最好清一次
    clearInterval(this.timer);
    _this.timer = setInterval(function () {
        _this.index++;
        //加上过渡
        _this.addTransition();
        //做位移
        _this.setTranslateX(-_this.index * _this.width);
    }, 3000);
};

/*倒计时*/
var DownTime = function(){
    /*dom*/
    this.els = document.querySelectorAll('.sk_time span');
    /*倒计时的时间*/
    this.time = 2 * 60 * 60;
    /*入口函数*/
    this.init();
};
DownTime.prototype.init = function(){
    var _this = this;
    _this.timer = setInterval(function(){
        _this.time --;
        var h = Math.floor(_this.time/3600);
        var m = Math.floor(_this.time%3600/60);
        var s = Math.floor(_this.time%60);
        //去修改dom的内容
        _this.els[0].innerHTML = Math.floor(h/10);
        _this.els[1].innerHTML = h%10;
        _this.els[3].innerHTML = Math.floor(m/10);
        _this.els[4].innerHTML = m%10;
        _this.els[6].innerHTML = Math.floor(s/10);
        _this.els[7].innerHTML = s%10;
        //倒计时结束
        if(_this.time <= 0){
            clearInterval(_this.timer);
        }
    },1000);
};
