/**
 * @summary CkEditorProvider providing a CkEditorContext that can wrap the CreateInterface component
 * @file This file is mainly used to providing CkEditorContext for ckEditor from CP
 * @author Irma Leandre
 * @since March 14, 2024
 * @copyright 2024 University of Kansas
*/
import React, { createContext, useContext } from 'react';

const CkEditorContext = createContext({});

// This provider holds functions from CP, so that KRI can trigger elements in CP
function CkEditorProvider({ children, ckEditorConfigVal }) {
  
  // The various media types the media library modal will have in its grid
  const mediaTypes = {
    imageGraphic: "Image/Graphic",
    video: "Video",
    audio: "Audio"
  };
  
  const value = {
    ...ckEditorConfigVal || useCkEditorConfig(), // try the prop first, then check for a context value
    mediaTypes
  };

    return <CkEditorContext.Provider value={value}>{children}</CkEditorContext.Provider>
}

export function useCkEditorConfig() {
  return useContext(CkEditorContext);
}

export default CkEditorProvider