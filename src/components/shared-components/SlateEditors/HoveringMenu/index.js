import { useEffect, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Editor, Range, Text, Transforms } from 'slate';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons';
import { Radio } from 'antd';

export const toggleFormat = (editor, format) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(editor, { [format]: isActive ? null : true }, { match: Text.isText, split: true });
};

const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: 'all',
  });
  return !!match;
};

const HoveringMenu = ({ dockRef }) => {
  const editor = useSlate();
  const { selection } = editor;
  const [open, setOpen] = useState(false);
  const [iLeft, setILeft] = useState('0px');
  const [iTop, setITop] = useState('0px');

  useEffect(() => {
    const domSelection = window.getSelection();

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      setOpen(false);
      return;
    }

    const getBoundingClientRect = () => domSelection.getRangeAt(0).getBoundingClientRect();
    const _dockRef = dockRef.current.getBoundingClientRect();

    setOpen(true);
    setILeft(`${getBoundingClientRect()?.left - _dockRef?.left}px`);
    setITop(`${getBoundingClientRect()?.top - _dockRef?.top - 28}px`);
  }, [editor, selection]);

  return (
    <div className="gx-portal" style={{ display: open ? 'block' : 'none', left: iLeft, top: iTop }}>
      <Radio.Group className="gx-custom-radio" size="small" onChange={(e) => toggleFormat(editor, e.target.value)}>
        <Radio.Button value="bold">
          <BoldOutlined />
        </Radio.Button>
        <Radio.Button value="italic">
          <ItalicOutlined />
        </Radio.Button>
        <Radio.Button value="underline">
          <UnderlineOutlined />
        </Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default HoveringMenu;
