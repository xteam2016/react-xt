import React, { Component, PropTypes } from 'react';
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.css'
import style from './PicMenu.less';
import classnames from 'classnames';
import format from '../../utils/format'
import BigMenu from '../MenuItem/MenuItem'

//有图模式
class PicMenu extends React.Component{



	constructor(props) {
        super(props);
        this.state = {
          viewNum:0,
 		};
    }

	componentDidMount() {
        //类目滑动

        let that = this;
        //初始化分类滑动
        const {shop} = this.props;
        if(!shop.loading){
            //数据已加在
            if(!this.galleryThumbs){
                //判断节点是否存在
                if($('.swiper-ls').length == 0){
                    return;
                }
                this.galleryThumbs = new Swiper('.swiper-ls', {
                    spaceBetween: 10,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    touchRatio: 1,
                    slideActiveClass: style['current'],
                    slideToClickedSlide: true,
                    controlBy: 'container',
                    onSlideChangeEnd: function(e) {
                        if(that.state.viewNum == e.activeIndex){
                            return;
                        }
                        that.setState({viewNum:e.activeIndex,oldNum:e.previousIndex})
                    }
                });

                this.galleryTop = new Swiper('.swiper-lx', {
                    //spaceBetween: 20,
                    speed: 500
                });
                this.galleryTop.params.control =  this.galleryThumbs;
            }

        }

        // if (this.refs.iscroll) {
        //     this.refs.iscroll.updateIScroll()
        // }

    }
    componentDidUpdate(){
        if(this.galleryTop){

            this.galleryTop.slideTo(this.state.viewNum);
            //就页面滑倒顶端
            $('.swiper-lx section:eq('+this.state.oldNum+')').scrollTop(0)
        }
    }
	//渲染分类菜品列表
    renderList(categoryid,key){
  
        if(key > this.state.viewNum+1 || key<this.state.viewNum-1){
            return
        }

        const { lists,time,shop } = this.props;
        const {data} = this.props.cat;
        

        if(shop.supplierdishlist.length == 0){
            return
        }

        const list = shop.supplierdishlist[key].supplierdishlist;

        return (
          <div className='clearfloat'>
            {list.map(item =>{
                let num = 0;
                //获取购物车数量
                
                let catDate = data.dishlist.filter(function(items){
                    return items.dishid == item.supplierdishid;
                });
                if(catDate.length!=0){
                    num = catDate[0].count;
                }
                return(
                    <BigMenu style='big' key={item.supplierdishid} data={item} catNum={num} onEditCart={this.props.handleEditCart.bind(this)} time={time} onClickSpec={this.props.handleSpec.bind(this)}></BigMenu>
                )
            })}
          </div>
        );
    };

    //渲染分类内容
    renderKindContent(){
        const {shop} = this.props;
        if(shop.loading){
            return;
        }
        const kinds = shop.supplierdishlist;
        return(
            <div className="swiper-wrapper">
            {kinds.map((item,key)=> <section key={'ks'+item.categoryid} className={style['swiper-slide']+" swiper-slide "+style['food-container']}>{this.renderList(item.categoryid,key)}</section>)}
            </div>
        )
    }

	    //渲染分类
    renderKind(){
        //获取分类
       
        const {shop} = this.props;
        if(shop.loading){
            return;
        }
        const kinds = shop.supplierdishlist;
        this.kinds = kinds;
         //console.log(shop)
        return(
            <ul className={style['wrapper-list']+' '+"swiper-wrapper"}> 
                {kinds.map(item=><li key={item.categoryid} className={style['swiper-slide']+' '+"swiper-slide"}>{item.categoryname}</li>)}
            </ul>
        )

    }

	render(){
		return(
			<section className={style["menu-main"]}>
				<div className={style["index-box"]}>
	                
	                <div className={"swiper-container swiper-ls "+style["swiper-ls"]} id="menu">
	                    {this.renderKind()}
	                </div>
	                
	                <div className={"swiper-container swiper-lx "+style["swiper-lx"]} >
	                   
	                    {this.renderKindContent()}
	               
	                </div>
	              
	            </div>
            </section>
		)
	}

	
};

export default PicMenu;

