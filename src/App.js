import React, { useEffect, useContext, useState }from 'react';
import { Box, Button, Checkbox, Slider } from '@material-ui/core';

import audios from './audio';

const refs = {};
const AudioContext = React.createContext();
const useAudio = () => useContext(AudioContext);
const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const value = {
    isPlaying,
    setIsPlaying,
    refs,
  };
  Object.keys(audios).forEach((key) => {
    if (!refs[key]) {
      refs[key] = React.createRef();
    }
  });
  return (
    <AudioContext.Provider value={value}>
      {Object.keys(audios).map((key) => <audio key={key} ref={refs[key]} src={audios[key]}/>)}
      {children}
    </AudioContext.Provider>
  );
};

const AudioSlider = () => {
  const { refs } = useAudio();
  const [sliderValue, setSliderValue] = useState(0);
  const sliderUnit = 373 / 100;
  const onChange = (_, value) => {
    const newCurrentTime = value * sliderUnit;
    Object.values(refs).forEach((ref) => {
      ref.current.currentTime = newCurrentTime;
    });
    setSliderValue(value)
  };

  return <Slider value={sliderValue} onChange={onChange} />;
};

const AudioVolume = ({ src }) => {
  const { refs } = useAudio();
  const audioRef = refs[src];
  const volume = !!audioRef.current?.volume;
  const [checked, setChecked] = useState(volume);
  console.log(refs?.f1?.current?.currentTime);
  useEffect(() => setChecked(volume), [volume]);
  const toggleVolume = () => {
    audioRef.current.volume = checked ? 0 : 1;
    setChecked(!checked);
  };
  return (
    <Checkbox onChange={toggleVolume} checked={checked}/>
  );
};

const PlayButton = () => {
  const { isPlaying, refs, setIsPlaying } = useAudio();
  console.log(refs);
  const label = isPlaying ? 'Pause' : 'Play';
  const onClick = () => {
    if (isPlaying) {
      Object.values(refs).forEach((ref) => {
        ref.current.volume = 0;
        ref.current.pause();
      });
    } else {
      const { current: { currentTime } } = refs.f1;
      Object.values(refs).forEach((ref) => {
        ref.current.volume = 1;
        ref.current.currentTime = currentTime;
        ref.current.play();
      });
    }
    setIsPlaying(!isPlaying)
  };

  return <Button onClick={onClick} variant="contained">{label}</Button>;
};

const App = () => (
  <AudioProvider>
    <p>Test</p>
    <AudioContext.Consumer>
      {(value) => Object.keys(value.refs).map((key) => <AudioVolume key={key} src={key} />)}
    </AudioContext.Consumer>
    <PlayButton />
    <Box width={500}>
      <AudioSlider />
    </Box>
  </AudioProvider>
);

export default App;
