import React, { useEffect, useContext, useState }from 'react';
import { Button, Checkbox } from '@material-ui/core';

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

const AudioVolume = ({ src }) => {
  const { refs } = useAudio();
  const audioRef = refs[src];
  const volume = !!audioRef.current?.volume;
  const [checked, setChecked] = useState(volume);
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
  const { piano: baseRef } = refs;
  const label = isPlaying ? 'Pause' : 'Play';
  const onClick = () => {
    if (isPlaying) {
      Object.values(refs).forEach((ref) => {
        ref.current.volume = 0;
        ref.current.pause();
      });
    } else {
      const { current: { currentTime } } = baseRef;
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
      {(value) => Object.keys(value.refs).slice(0, -1).map((key) => <AudioVolume key={key} src={key} />)}
    </AudioContext.Consumer>
    <PlayButton />
  </AudioProvider>
);

export default App;
