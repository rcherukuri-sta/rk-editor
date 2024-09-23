/**
 * @summary Common custom CK-Editor
 * @file This is to build the CK-Editor 5 from ClassicEditor source. If the type is 'inline', then InlineEditor source
 * @author Chandana Mahesh, Krishnaprasath Santhinivasan, Cherukuri Rajendra Kumar, Surya Kavutarapu, Balaji Ganesan
 * @since Oct 19, 2021
 * @copyright 2021 - 2022 University of Kansas
 */
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

// NOTE: We use editor from source (not a build)!
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import PropTypes from 'prop-types';
import defaultEditorConfig from './editorConfig';

import Delayed from './Delayed';

const CKEditorBase = forwardRef(function CKEditorBase({
  fieldName = null,
  data = '',
  type = 'classic',
  onReady,
  onChange,
  onBlur,
  onFocus = () => {},
  className,
  dataTestId,
  displayEditorCount = true,
  delay = 0.005,
  trim = true,
  ...props
}, ckEditorRef) {
  const ref = useRef(null);
  let configuration = defaultEditorConfig;
  let options = {};

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

  /**
   * seems CK-Editor does not support dynamic configuration, so the CK-Editor will reinitilized when we change to the new keyboard.
   * Resets the CK-Editor when in the preview scale is changed, so it can handle the re-position view like Math Editor
  */
  useEffect(() => {
    if (configuration.mathLive?.keyboardType && ready) {
      setReady(false); // When a new keyboard layout is passed, CK-Editor will destroyed
    }
  }, [configuration.mathLive?.keyboardType]);
  useEffect(() => {
    if (configuration.mathLive?.keyboardType && !ready) {
      setReady(true); // When a new keyboard layout is passed, CK-Editor will initialized again
    }
  }, [ready]);

  console.log('CKEditorBase', { data, type, onReady, onChange, onBlur, onFocus, className, dataTestId, displayEditorCount, delay, trim, ...props });

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
