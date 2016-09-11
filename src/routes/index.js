import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

import MainLayout from '../layouts/RouteLayout/RouteLayout'
import NotFound from '../components/NotFound';
import Setting from '../view/Setting/Center';
import ComList from '../view/Component/List';
import ComDetail from '../view/Component/Detail';
import Home from "../view/Home/Home"
import Error from "../view/404/Error";

import NewMenu from '../view/Menu/NewMenu';
//Example List
import ExLazyLoader from "../view/Example/LazyLoader";
import ExDataSource from "../view/Example/DataSource";


class Routes extends React.Component {
  componentDidMount(){

  }
  routerEnter({routes}){
    try{
        const component = routes[routes.length-1].component;
        const name = (component.WrappedComponent||component).name;
        document.body.className = (name?'view_'+name.toLowerCase():'');
      }
      catch(error){
        console.error('error in routes/index: componennt name 读取错误');
      }
  }
  render(){
    const history = this.props.history;

    return(<Router history={history}>
      <Route path="/" component={MainLayout} onEnter={this.routerEnter}>
        // 主页
        <IndexRoute component={Home} onEnter={this.routerEnter} />
        // 个人中心
        <Route path="setting" component={Setting} onEnter={this.routerEnter} />
        // 组件列表
        <Route path="comlist" component={ComList} onEnter={this.routerEnter} />
        // 组件详情
        <Route path="component/detail/:id" component={ComDetail} onEnter={this.routerEnter} />
        //Example List
        <Route path="example/lazyloader" component={ExLazyLoader} onEnter={this.routerEnter} />
        <Route path="example/datasource" component={ExDataSource} onEnter={this.routerEnter} />
        // 点餐
        <Route path="menu/:style/:id" component={withRouter(NewMenu)} onEnter={this.routerEnter} />
        
        <Route path="*" component={Error} onEnter={this.routerEnter} />
      </Route>
    </Router>);
  }
}

Routes.propTypes = {
  history: PropTypes.any,
};

function mapStateToProps(state, props) {
  return {
    // menus:menus
  };
}
export default connect(mapStateToProps)(Routes);
