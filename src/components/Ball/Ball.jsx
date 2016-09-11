import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import style from './Ball.less';
import classnames from 'classnames';

export default class Ball extends Component{

    constructor(props) {
        super(props);
        this.state = {count:-1};
        this.count = -1;
        this.settings = {
            vertex_Rtop:20, // 默认顶点高度top值
            speed : 1.2,
            start:this.props.opt.start,
            end:this.props.opt.end
        }
        this.initBall()
       
    }

    initBall(){
        //加载完成调用动画
        const start = this.props.opt.start,
            end = this.props.opt.end,
            settings = this.settings;
        if (end.width != null && end.height != null) {
            $.extend(true, start, {
              // width: refs.ball.width(),
              // height: refs.ball.height()
              width:30,
              height:30
            });
        }

          // 运动轨迹最高点top值

          /*
            
          */
        var vertex_top = Math.min(start.top, end.top) - Math.abs(start.left - end.left) / 3; // ?
        // var vertex_top = Math.min(start.top, end.top)-30;
        if (vertex_top < settings.vertex_Rtop) {

        // 可能出现起点或者终点就是运动曲线顶点的情况
            vertex_top = Math.min(settings.vertex_Rtop, Math.min(start.top, end.top));
        }

          /**
           * ======================================================
           * 运动轨迹在页面中的top值可以抽象成函数 y = a * x*x + b;
           * a = curvature
           * b = vertex_top
           * ======================================================
           */

           // 两个元素之间的距离
            var distance = Math.sqrt(Math.pow(start.top - end.top, 2) + Math.pow(start.left - end.left, 2)),
            
            // 元素移动次数
            steps = Math.ceil(Math.min(Math.max(Math.log(distance) / 0.05 - 75, 30), 100) / settings.speed),
            //steps=50;

            //  Math.sqrt(x): 计算根号下x， 2:√x 
            ratio = start.top == vertex_top ? 0 : -Math.sqrt((end.top - vertex_top) / (start.top - vertex_top)),

            vertex_left = (ratio * start.left - end.left) / (ratio - 1),
            
            // 特殊情况，出现顶点left==终点left，将曲率设置为0，做直线运动。
            curvature = end.left == vertex_left ? 0 : (end.top - vertex_top) / Math.pow(end.left - vertex_left, 2);


            this.settings = {
                count: -1, // 每次重置为-1
                steps: steps,
                vertex_left: vertex_left,
                vertex_top: vertex_top,
                curvature: curvature,
                start:start,
                end:end
            }
   

    }

    componentDidMount(){

        this.setState({count:-1})
            //开始动画
            // window.requestAnimationFrame(()=>{
            //     this.setState({count:-1})
            // });
    }
    componentDidUpdate(){

        this.count = this.count+1
     
        
        var tcount = this.state.count+1;
        if (tcount != this.settings.steps) {
            //this.setState({count:tcount})
            window.requestAnimationFrame(()=>{
                console.log(1)
                this.setState({count:tcount})
            });
        }
    }

    move(){
        var settings = this.settings,
            start = settings.start,
            count = this.state.count,
            steps = settings.steps,
            end = settings.end;
        let domStyle;
        
          // 计算left top值
          var left = start.left + (end.left - start.left) * count / steps,
            top = settings.curvature == 0 ? start.top + (end.top - start.top) * count / steps : settings.curvature * Math.pow(left - settings.vertex_left, 2) + settings.vertex_top;
          // 运动过程中有改变大小
          if (end.width != null && end.height != null) {
            var i = steps / 2,
              width = end.width - (end.width - start.width) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2),
              height = end.height - (end.height - start.height) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2);
            
            domStyle = {
                width:width,
                height:height,
                fontSize:Math.min(width, height)
            }
          }

          domStyle = {
            ...domStyle,
            left:left,
            top:top
          }

       
 
          return domStyle;
    }




    render(){
        // var styleDom = {
        //     left:this.props.opt.start.left,
        //     top:this.props.opt.start.top,
        // }
        var styleDom = this.move();
  
        return (
            <div ref='ball' className={style["ball"]} style={styleDom}></div>
        );
    }
}
Ball.propTypes = {

};



