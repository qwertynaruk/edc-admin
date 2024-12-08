import { Slider } from 'antd';

export default function AgeSlider(props) {
  return <Slider marks={{ 0: 0, 150: 150 }} defaultValue={[38, 112]} range max="150" {...props} />;
}
