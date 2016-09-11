import React, { Component, PropTypes } from 'react';
import Todos from './Todos/Todos';
import MainLayout from '../layouts/MainLayout/MainLayout';

const App = ({ location }) => {
  return (
    <MainLayout title="ss">
      <Todos location={location} ppp="ss"/>
    </MainLayout>
  );
};

App.propTypes = {
};

export default App;
