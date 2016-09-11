import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
require('./NavBar.less');

class NavBar extends Component{

  leftClickHandle(){
    if(this.props.opt.backFunction && this.props.opt.backFunction()){
      return;
    }

    if(this.props.backurl){
      this.props.router.replace(this.props.backurl);
      return
    }
    if(this.props.history.length == 1){
        this.props.router.replace('/');
    }else{
      this.props.router.goBack(-1);
    }
  }

  render(){
    const {opt={}, title, children} = this.props;
    const cs = classnames({
      ["header"]: true,
      ["header-wrap"]:opt.fixed!==false,
      ['style-'+opt.style]: opt.style
    })
      return (
        <div className={cs}>
          {opt.noBack?null:(<div className="nav-left" onTouchTap={this.leftClickHandle.bind(this)}>
            <em className='m-icon i-back m-icon'></em>
          </div>)}
          <div className="title">
            {title}
          </div>
          <div className="nav-right">
            {children}
          </div>
        </div>
      );
  }
}
NavBar.propTypes = {
	//data: PropTypes.object.isRequired,
	//onToggleComplete: PropTypes.func.isRequired,
};
// NavBar.contextTypes = {
//   router: React.PropTypes.func.isRequired
// };

;
export default connect(function(state, props){
  return {
    history: history
  }
})(withRouter(NavBar));
// export default NavBar;

