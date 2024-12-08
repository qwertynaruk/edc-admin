import { ContentState, EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const createWithContent = (value) => {
  const blocksFromHtml = htmlToDraft(value);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
  return EditorState.createWithContent(contentState);
};

const WYSIWYGV2 = (props) => {
  const { value, onChange, readOnly = false, ...otherProps } = props;

  const [editorState, setEditorState] = useState(() => {
    if (value) {
      return createWithContent(value);
    }
    return EditorState.createEmpty();
  });

  const onEditorStateChange = (value) => {
    setEditorState(value);
    if (!onChange) return;
    onChange(draftToHtml(convertToRaw(value.getCurrentContent())));
  };
  return (
    <Editor
      toolbar={{
        options: ['inline', 'history'],
        inline: {
          options: ['bold', 'italic', 'underline'],
        },
      }}
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      {...otherProps}
      readOnly={readOnly}
    />
  );
};
export default WYSIWYGV2;
