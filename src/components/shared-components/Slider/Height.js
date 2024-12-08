import { Slider } from 'antd';

export default function HeightSlider(props) {
  return <Slider marks={{ 0: 0, 250: 250 }} defaultValue={[63, 187]} range max="250" {...props} />;
}
