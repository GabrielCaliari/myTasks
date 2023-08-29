import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';

interface IProps {
  children: React.ReactElement;
}

export interface ITask {
  id: string;
  title: string;
}

export interface ITasksContext {
  tasks: ITask[];
  addTask(task: ITask): void;
  removeTask(id: string): void;
}

const tasksData = '@MyTasks:Tasks';

const TasksContext = createContext<ITasksContext>({} as ITasksContext);

export const TasksProvider: React.FunctionComponent<IProps> = ({children}) => {
  const [data, setData] = useState<ITask[]>([]);

  useEffect(() => {
    async function loadStoragedData() {
      const storageId = await AsyncStorage.getItem(tasksData);

      if (storageId) {
        setData(JSON.parse(storageId));
      }
    }
    loadStoragedData();
  }, []);

  const addTask = async (task: ITask) => {
    try {
      const newTaskList = [...data, task];
      setData(newTaskList);
      await AsyncStorage.setItem(tasksData, JSON.stringify(newTaskList));
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const removeTask = async (id: string) => {
    const newTaskList = data.filter(task => task.id !== id);
    setData(newTaskList);
    await AsyncStorage.setItem(tasksData, JSON.stringify(newTaskList));
  };
  return (
    <TasksContext.Provider value={{tasks: data, addTask, removeTask}}>
      {children}
    </TasksContext.Provider>
  );
};

export function useTasksList(): ITasksContext {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasksList deve ser usado em um TasksProvider');
  }
  return context;
}

export default TasksContext;
