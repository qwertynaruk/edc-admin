import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-onelife-custom-build';
import { css } from '@emotion/css';

const DEFAULT_MIN_HEIGHT = 200;
const DEFAULT_MAX_HEIGHT = 500;

export const Ckeditor = ({ value, onChange, minHeight = DEFAULT_MIN_HEIGHT, maxHeight = DEFAULT_MAX_HEIGHT }) => {
  return (
    <div
      className={css`
        .ck {
          background-color: #1b2531 !important;
        }

        .ck-button {
          color: #fff !important;
        }

        .ck-content {
          min-height: ${minHeight}px;
          max-height: ${maxHeight}px;
          overflow-y: auto;
        }

        .ck-sticky-panel__content {
          border: 1px solid #000 !important;
          border-bottom: none !important;
        }

        .ck-editor__editable:not(.ck-focused) {
          border: 1px solid #000 !important;
        }

        .ck-file-dialog-button {
          pointer-events: none;
        }

        .ck-image-insert-form > .ck-file-dialog-button {
          display: none !important;
        }
      `}
    >
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{}}
      />
    </div>
  );
};
