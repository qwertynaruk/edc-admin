import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Editor, Range, Transforms, createEditor } from 'slate';
import { Editable, ReactEditor, Slate, useFocused, withReact } from 'slate-react';
import { Alert, Typography } from 'antd';
import { toJS } from 'mobx';
import FuncStore from 'mobx/FuncStore';
import HoveringMenu from './HoveringMenu';

const SlateEditors = ({ defaultValue = '' }) => {
  const ref = useRef();
  const dockRef = useRef();
  const inFocus = useFocused();
  const [target, setTarget] = useState();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withReact(createEditor()), []);
  const inList = toJS(FuncStore.itemSuggestion);
  const chars = inList.filter((item) => item.toLowerCase().includes(search.toLowerCase())).slice(0, 10);

  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: defaultValue }],
    },
  ];

  const onKeyDown = useCallback(
    (event) => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            if (index >= chars.length - 1) {
              setIndex(0);
            } else {
              setIndex(index + 1);
            }
            break;
          case 'ArrowUp':
            event.preventDefault();
            if (index <= 0) {
              setIndex(chars.length - 1);
            } else {
              setIndex(index - 1);
            }
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);
            editor.insertText(chars[index]);
            setTarget(null);
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [index, search, target]
  );

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      const _dockRef = dockRef.current.getBoundingClientRect();
      try {
        const domRange = ReactEditor.toDOMRange(editor, target);
        const rect = domRange.getBoundingClientRect();

        el.style.top = '24px';
        el.style.left = `${rect?.left - _dockRef?.left + 16}px`;
      } catch (error) {
        return null;
      }
    }
  }, [chars.length, editor, index, search, target, inFocus]);

  return (
    <div ref={dockRef} style={{ position: 'relative' }}>
      <Slate
        editor={editor}
        value={initialValue}
        onChange={() => {
          const { selection } = editor;

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: 'word' });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText = beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(/^@(.+)$/);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
              setTarget(beforeRange);
              setSearch(beforeMatch[1]);
              setIndex(0);
              return;
            }
          }

          setTarget(null);
        }}
      >
        <HoveringMenu dockRef={dockRef} />
        <Editable
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          placeholder="กำลังพิมพ์..."
          renderPlaceholder={({ children, attributes }) => (
            <div {...attributes}>
              <p>{children}</p>
              <Alert showIcon type="info" message="โปรดระบุอะไรก็ได้เพื่อให้รายงานนี้สมบูรณ์" />
            </div>
          )}
        />
        {target && chars.length > 0 && (
          <div
            ref={ref}
            style={{
              top: '-9999px',
              left: '-9999px',
              position: 'absolute',
              zIndex: 100,
              padding: '3px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            }}
          >
            {chars.map((char, i) => (
              <div
                key={char}
                style={{
                  padding: '1px 3px',
                  borderRadius: '3px',
                  background: i === index ? '#B4D5FF' : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  Transforms.select(editor, target);
                  editor.insertText(chars[i]);
                  setTarget(null);
                }}
              >
                <Typography.Text style={{ color: '#000' }}>{char}</Typography.Text>
              </div>
            ))}
          </div>
        )}
      </Slate>
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default SlateEditors;
