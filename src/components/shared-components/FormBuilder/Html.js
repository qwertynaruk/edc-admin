export default function Html(props) {
  const { value } = props;
  return <div dangerouslySetInnerHTML={{ __html: value }} />;
}
