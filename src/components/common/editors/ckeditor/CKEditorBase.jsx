/**
 * @summary Common custom CK-Editor
 * @file This is to build the CK-Editor 5 from ClassicEditor source. If the type is 'inline', then InlineEditor source
 * @author Chandana Mahesh, Krishnaprasath Santhinivasan, Cherukuri Rajendra Kumar, Surya Kavutarapu, Balaji Ganesan
 * @since Oct 19, 2021
 * @copyright 2021 - 2022 University of Kansas
 */
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useLayoutEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useCkEditorConfig } from '../../../common/CkEditorProvider';

// NOTE: We use editor from source (not a build)!
import WProofreader from '@webspellchecker/wproofreader-ckeditor5/src/wproofreader';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PropTypes from 'prop-types';
import defaultEditorConfig from './editorConfig';

import Delayed from './Delayed';
// import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

/**
 * React functional component with the custom CKEditor
 * which will be used across the application.
 * This is to build the CKEditor from ClassicEditor source. If the type is 'inline',
 * it will be from InlineEditor source.
 *
 * @inner
 * @memberof SharedComponents
 *
 * @component
 * @namespace CKEditorBase
 * @param {{fieldName: string, data: string, type: string, onReady: function,
 * onChange: function, onBlur: function, onFocus: function,
 * config: object, placeholder: string, className: string, dataTestId: string}} param passed in parameters
 * @param {string} param.fieldName - name of the field for the CKEditor
 * @param {string} param.data - inital data that will be displayed in the CKEditor
 * @param {string} param.type - indicates if it is inline editor or classic editor. Default is classic.
 * @param {function} param.onReady - function that need to be called onReady event
 * @param {function} param.onChange - function that need to be called onChange event
 * @param {function} param.onBlur - function that need to be called onBlur event
 * @param {function} param.onFocus - function that need to be called onFocus event
 * @param {object} param.config - optional, custom config object that can add/modify/override the default configuration only for the respective editor.
 * @param {string} param.placeholder - optional, string will show as the placeholer for the editor
 * @param {string} param.className - optional, apply class name to the editor container that can use for styling/identification/other development purpose
 * @param {string} param.dataTestId - optional, test id to the editor container for testing purpose
 * @param {boolean} param.displayEditorCount - optional, is the word/char count details needs to displayed or not for the editor, default is true
 * @param {number} param.delay - optional, represent the delay in loading the editor, has the minimum delay as default
 * @param {boolean} param.trim - optional, it will return space, if space is typed in ckeditor.

 * @return {Component} - Classic CKEditor with default configuration
 *
 * @example
 * <CKEditorBase data={data} onChange= {onUpdate}/>
 */

const CKEditorBase = forwardRef(function CKEditorBase({
  fieldName = null,
  data = '',
  type = 'classic',
  onReady,
  onChange,
  onBlur,
  onFocus = () => {},
  config = {},
  placeholder,
  className,
  dataTestId,
  displayEditorCount = true,
  delay = 0.005,
  trim = true,
  id,
  itemRef,
  ...props
}, ckEditorRef) {
  const scale = useScale();
  const ref = useRef(null);
  let configuration = defaultEditorConfig;
  let options = {};

  /**
   * Grabs data (passed in from CP) from the CKEditorConfig to use when interacting with the editor
   */
  const ckEditorConfig = useCkEditorConfig(); // uses the CkEditor Context object
  const {onShowMediaLibrary} = ckEditorConfig; // decontructs functions that are needed to interact with CP


  const [editor, setEditor] = useState(null);
  const [ready, setReady] = useState(true);

  //impertive ref used to focus inside the CKEditor when switch controls are active
  useImperativeHandle(ckEditorRef, () => ({
    focusInput: () => {
      if (editor) {
        editor?.editing?.view?.focus();
      }
    }
  }), [editor]);

  if (editor?.id) {
    const model = editor.model;
    const selection = editor.editing.model.document.selection;
    let modelElement = selection?.getSelectedElement() || selection?.getLastPosition();
    if (modelElement?.parent?.name === "nestedelementaccessibility") {
      let wholeElememt = selection?.getLastPosition()?.parent;
      let nestedChildCount = wholeElememt?.childCount ? wholeElememt.childCount : 0;
      if (!nestedChildCount) {
        model.change(writer => {
          writer.remove(wholeElememt);
        });
      }
    }
  }

   const [wordsCount, setWordsCount] = useState(0);
  const [charsCount, setCharsCount] = useState(0);

  if (trim === false) {
    options.trim = 'none';
  }

  // Handling the focus switch issues with special accessibility such as Math with/without normal Text
  const handleClickOutside = (event) => {
    if (editor?.id) {
      const focusTracker = editor.ui?.focusTracker;
      if (ref.current && !ref.current.contains(event.target) && !event.target.closest('div#' + editor.id)) {
        const activeElement = document.activeElement;
        const fakeSelection = editor.editing?.view?.document?.selection?.isFake && activeElement.closest('div#' + editor.id) != null && activeElement.querySelectorAll('.ck-widget.ck-widget_selected')?.length === 0;
        const currentEditorCheck = activeElement.closest('div.ck-balloon-panel') == null && event.target.closest('div.ck-balloon-panel') == null; // && activeElement.closest('div#' + editor.id) == null;
        const externalFocusCheck = fakeSelection || (currentEditorCheck
          && (editor.editing?.view?.document?.isFocused || focusTracker?.focusedElement || editor.editing?.view?.hasDomSelection));
        const selection = editor.editing.model.document.selection;
        let modelElement = selection?.getSelectedElement() || selection?.getLastPosition()?.parent;
        const viewElement = editor.editing?.view?.document?.selection?.getSelectedElement();
        const mathRelated = ['nestedelementaccessibility', 'mathtextaccessibility', 'mathtex-inline', 'mathtex-display'];
        const specialAccessibilitySelected = mathRelated.includes(modelElement?.name) || viewElement?.getAttribute('class')?.split(' ')?.includes('ck-widget');
        if (externalFocusCheck && specialAccessibilitySelected) {
          const customSelection = selection?._selection;
          if (customSelection) {
            customSelection.setFocus(modelElement, 'end');
            customSelection.setTo(null);
            selection.refresh();
            editor.model.change((writer) => {
              // check the selection still exists for the element (table)
              modelElement = selection?.getSelectedElement() || selection?.getLastPosition()?.parent;
              if (editor.editing.view.document.selection.isFake && modelElement?.name === 'table') {
                // if selection exists, then remove it
                writer.setSelection(writer.createPositionAt(modelElement.getNodeByPath([0, 0, 0]), 0));
                selection.refresh();
              }
            });
          }
          document.querySelector('#' + editor.id + ' [contenteditable="true"]')?.blur();
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [editor?.id]);

  useLayoutEffect(() => {
    // TODO: when we will be working on the backlog issue that to support to add math accessibility inside the test accessibility, then this can be handled/removed later.
    let observer;
    if (ref?.current && editor) {
      const type = editor?.config?.get('insertResponse')?.type;
      if (type) { // only for the insert response based editor
        observer = useMutationObserver(ref, () => { // nested text accessibilty has delay in load, so has to wait before the check
          if (type) {
            if (type === 'selectText') { // nested element accessibilty for select text should support inline, if it not contain MATH elements
              const parentElements = ref?.current?.querySelectorAll('.nested-element-accessibility:not(.nested-accessibility-inline-response)') || [];
              Array.from(parentElements)?.map(textElement => {
                if (textElement?.querySelectorAll('.math-tex')?.length === 0) { // Check is it non Math elemnts
                  textElement.classList?.add('nested-accessibility-inline-response');
                }
              });
            } else {
              const parentElements = ref?.current?.querySelectorAll('.text-tag-accessibility, .nested-tag-accessibility') || [];
              Array.from(parentElements)?.map(textElement => {
                const childElements = textElement.querySelectorAll('.gap-match-placeholder, .constructedResponse-placeholder, .cked-highlight');
                // Check if the 'nested-element-accessibility' class is already present
                const containsClass = textElement.classList?.contains('nested-element-accessibility');
                Array.from(childElements)?.map(element => {
                  if (element && !containsClass) { // add appropriate the class to support the TTS hightlight styles
                    textElement.classList?.add('nested-element-accessibility');
                  }
                });
              });
            }
          }
        }, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'data-access-id'], attributeOldValue: true });
      }
    }
    return () => {
      if (observer) {
        observer.disconnect(); // disconnect observer when unmount
      }
    };
  }, [ref.current, editor]);


  /**
   * seems CK-Editor does not support dynamic configuration, so the CK-Editor will reinitilized when we change to the new keyboard.
   * Resets the CK-Editor when in the preview scale is changed, so it can handle the re-position view like Math Editor
  */
  useEffect(() => {
    if (configuration.mathLive?.keyboardType && ready) {
      setReady(false); // When a new keyboard layout is passed, CK-Editor will destroyed
    }
  }, [configuration.mathLive?.keyboardType, scale]);
  useEffect(() => {
    if (configuration.mathLive?.keyboardType && !ready) {
      setReady(true); // When a new keyboard layout is passed, CK-Editor will initialized again
    }
  }, [ready]);

  return (
    <div
      ref={ref}
      id={editor?.id}
      className={className}
      data-testid={
        dataTestId !== undefined ? dataTestId : 'ck-editor-5-container'
      }
    >
      <Delayed waitBeforeShow={delay}>
        {ready
          ? <CKEditor
            {...props}
            ref={itemRef}
            editor={type === 'inline' ? InlineEditor : ClassicEditor}
            config={{ ...configuration }}
            data={data}
            onReady={(ckeditor) => {
              // Enable in development mode for better plugin development
              // CKEditorInspector.attach( ckeditor );
              if (!editor) {
                setEditor(ckeditor);
                if (onReady) {
                  onReady(ckeditor);
                }
              }
              // Disable spellcheck, autocomplete, and autocorrect
              ckeditor.editing.view.change(writer => {
                const root = ckeditor.editing.view.document.getRoot();
                writer.setAttribute('spellcheck', 'false', root);
                writer.setAttribute('autocomplete', 'off', root);
                writer.setAttribute('autocorrect', 'off', root);
              });
            }}
            onChange={
              /* istanbul ignore next */
              (_event, editor) => {
                const focusTracker = editor?.ui?.focusTracker; // help to find the correct focus info, even if the focus is in the ckeditor popup/panel (related to #2110)
                if (editor?.editing?.view?.document?.isFocused || (focusTracker?.isFocused && focusTracker?.focusedElement)) { // to handle calling onChange indirectly by CKEditor issue, When having the duplicate inline editor that updates the content dynamically. This issue rarely occurs, yet to find the actual steps for those.
                  const value = editor.getData(options);
                  if (type === 'inline') {
                    // provide a way to parent component to update stemContents in case of a loop
                    onChange(value);
                  } else {
                    // update store directly using fieldName in case of stem update
                    onChange(fieldName, value);
                  }
                }
              }
            }
            onBlur={onBlur}
            onFocus={onFocus}
          />
          : null
        }
        {
          displayEditorCount &&
          <div className={type === 'inline' ? 'wordscount-inline' : 'wordscount'}>
            <span> Words : {wordsCount}, </span>
            <span>Characters : {charsCount} </span>
          </div>
        }
      </Delayed>
    </div>
  );
});

CKEditorBase.propTypes = {
  fieldName: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.elementType
  ]),
  type: PropTypes.string,
  config: PropTypes.object,
  onChange: PropTypes.func,
  onReady: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  displayEditorCount: PropTypes.bool,
  delay: PropTypes.number,
  trim: PropTypes.bool
};

export default CKEditorBase;
