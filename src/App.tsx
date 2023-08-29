import React from 'react';
import {Home} from './pages/Home';
import {TasksProvider} from './contexts/TasksContext';

const App = () => {
  return (
    <TasksProvider>
      <Home />
    </TasksProvider>
  );
};

export default App;
