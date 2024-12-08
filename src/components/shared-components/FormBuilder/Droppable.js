import { useRef, useState } from 'react';
import { useDrop } from 'ahooks';
import { css } from '@emotion/css';

function Space({ size = '52px' }) {
  return (
    <div
      className={css`
        height: ${size};
      `}
    />
  );
}

export default function Droppable({ children, ...props }) {
  // const [isHoveringTop, setIsHoveringTop] = useState(false);
  const [isHoveringBot, setIsHoveringBot] = useState(false);

  // const dropTopRef = useRef(null);
  const dropBotRef = useRef(null);

  // useDrop(dropTopRef, {
  //   onText: (text, e) => {
  //     console.log(e);
  //     alert(`'text: ${text}' dropped`);
  //   },
  //   onFiles: (files, e) => {
  //     console.log(e, files);
  //     alert(`${files.length} file dropped`);
  //   },
  //   onUri: (uri, e) => {
  //     console.log(e);
  //     alert(`uri: ${uri} dropped`);
  //   },
  //   onDom: (content, e) => {
  //     alert(`custom: ${content} dropped`);
  //   },
  //   onDragEnter: () => setIsHoveringTop(true),
  //   onDragLeave: () => setIsHoveringTop(false),
  //   onDrop: () => setIsHoveringTop(false),
  // });

  useDrop(dropBotRef, {
    onText: (text, e) => {
      console.log(text, e);
      // alert(`'text: ${text}' dropped`);
    },
    onFiles: (files, e) => {
      console.log(e, files);
      // alert(`${files.length} file dropped`);
    },
    onUri: (uri, e) => {
      console.log(e);
      // alert(`uri: ${uri} dropped`);
    },
    // onDom: (content, e) => {
    //   // alert(`custom: ${content} dropped`);
    //   console.log(content, e);
    // },
    onDom: (content) => {
      if (!isHoveringBot) {
        return;
      }
      // console.log(isHoveringBot, 'alskjdflkjs', content);
      // console.log('alksjdf', props.onDom);
      props.onDom(content);
    },
    onDragEnter: () => setIsHoveringBot(true),
    onDragLeave: () => setIsHoveringBot(false),
    onDrop: () => setIsHoveringBot(false),
  });

  return (
    <>
      {/* <div ref={dropTopRef}>{isHoveringTop ? <Space /> : null}</div> */}
      <div ref={dropBotRef}>
        {children}
        {isHoveringBot ? 'hovering' : 'not hovering'}
        {isHoveringBot ? <Space /> : <Space size="1rem" />}
      </div>
    </>
  );
}
