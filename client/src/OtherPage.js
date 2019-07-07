import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div>
      I'm the other page {':)'}
      <br />
      <Link to="/">Let's get back home...</Link>
    </div>
  );
};
