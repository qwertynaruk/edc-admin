import Block from './Block';

export default function Blocks(props) {
  const { blocks } = props;
  if (Array.isArray(blocks)) {
    return blocks.map((child, index) => <Block key={child.id || index} {...child} />);
  }
  return <Block {...blocks} />;
}
