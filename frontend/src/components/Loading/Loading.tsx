import React from 'react';
import { Spin } from 'antd';

const App: React.FC = () => (
  <div className="flex flex-grow justify-center items-center w-full h-screen">
    <Spin size="large" />
  </div>
);

export default App;
