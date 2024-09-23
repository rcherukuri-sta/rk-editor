/**
 * @summary CkEditorProvider providing a CkEditorContext that can wrap the CreateInterface component
 * @file This file is mainly used to providing CkEditorContext for ckEditor from CP
 * @author Irma Leandre
 * @since March 14, 2024
 * @copyright 2024 University of Kansas
*/
import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const CkEditorContext = createContext({});

export function useCkEditorConfig() {
  return useContext(CkEditorContext);
}


// This provider holds functions from CP, so that KRI can trigger elements in CP
function CkEditorProvider({ children, ckEditorConfigVal }) {
  // Call the hook unconditionally
  const contextValue = useCkEditorConfig();

  // The various media types the media library modal will have in its grid
  const mediaTypes = {
    imageGraphic: "Image/Graphic",
    video: "Video",
    audio: "Audio"
  };

  const value = {
    ...(ckEditorConfigVal || contextValue), // try the prop first, then check for a context value
    mediaTypes
  };

  return <CkEditorContext.Provider value={value}>{children}</CkEditorContext.Provider>
}


export default CkEditorProvider

CkEditorProvider.propTypes = {
  ckEditorConfigVal: PropTypes.any,
  children: PropTypes.any
};
