import React from 'react';
import CKEditorBase from './components/common/editors/ckeditor/CKEditorBase';

function App() {
  const onChange = (event, editor) => {
    const data = editor.getData();
    console.log({ event, editor, data });
  };
  return (
    <>
      <h1>React App</h1>
      <p>React app is running</p>
      <CKEditorBase
        type='inline'
        placeholder='Enter Item Header'
        data = {"<p>React app is running</p>"}
        onChange={onChange}
        onBlur={onChange}
        onReady={onChange}
        // {...props}
      />
    </>
  );
}

export default App;
