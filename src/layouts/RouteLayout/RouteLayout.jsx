import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './RouteLayout.less'

const MainLayout = ({ children }) => {

  return (

    <ReactCSSTransitionGroup
        component="div"
        className="route-class"
        transitionLeave={false}
        transitionName={{
          enter: 'page-enter',
          enterActive: 'page-enter-active',
        }}
        transitionEnterTimeout={300}
      >
    {React.cloneElement(children,{ key: location.pathname })}
    </ReactCSSTransitionGroup>
  
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;
