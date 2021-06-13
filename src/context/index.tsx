import { createContext, useContext, useReducer, useEffect, FC } from 'react';

import reducer from './reducer';
import * as types from './types';
import { defaultFilesData, defaultFilesList, defaultActiveFile } from './data';

const initialState: types.IState = {
  activeFile: defaultActiveFile,
  filesList: defaultFilesList,
  filesData: defaultFilesData,
  addFile: () => null,
  removeFile: () => null,
  changeActiveFile: () => null,
  addFileData: () => null,
};

const AppContext = createContext<types.IState>(initialState);

const Context: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Check previous data is saved
    if (localStorage.getItem('_id')) {
      console.log('data hai');
    }
  }, [state.filesData]);

  const addFile = (fileData: types.fileData) => {
    dispatch({
      type: types.ADD_FILE,
      payload: fileData,
    });
  };

  const removeFile = (filename: string) => {
    dispatch({
      type: types.REMOVE_FILE,
      payload: filename,
    });
  };

  const changeActiveFile = (fileData: types.fileData) => {
    dispatch({
      type: types.CHANGE_FILE,
      payload: fileData,
    });
  };

  const addFileData = (fileData: types.fileData) => {
    dispatch({
      type: types.ADD_FILE_DATA,
      payload: fileData,
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeFile: state.activeFile,
        filesList: state.filesList,
        filesData: state.filesData,
        addFile,
        removeFile,
        changeActiveFile,
        addFileData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined)
    throw new Error('useContext must be used within a AppContext Provider.');

  return context;
};

export { Context, useAppContext };
