import {
  ControlBar,
  CurrentTimeDisplay,
  ForwardControl,
  PlaybackRateMenuButton,
  Player,
  ReplayControl,
  TimeDivider,
  VolumeMenuButton,
} from 'video-react';

const PlayVideos = ({ form, poster = null }) => {
  return (
    <Player poster={poster || ''} fluid={false} width={400} height={200}>
      {/* <Player poster={poster || ''} > */}
      <source src={form} />

      <ControlBar>
        <ReplayControl seconds={10} order={1.1} />
        <ForwardControl seconds={30} order={1.2} />
        <CurrentTimeDisplay order={4.1} />
        <TimeDivider order={4.2} />
        <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
        <VolumeMenuButton />
      </ControlBar>
    </Player>
  );
};

export default PlayVideos;
