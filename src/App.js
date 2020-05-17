import React, { forwardRef, useRef, useState }from 'react';
import { Button, Checkbox as Cb } from '@material-ui/core/';

import audios from './audio';

const CheckBox = forwardRef((_, audioRef) => {
  const [checked, setChecked] = useState(true);
  const onChange = () => {
    if (checked) {
      audioRef.current.volume = 0;
      setChecked(false);
    } else {
      audioRef.current.volume = 1;
      setChecked(true);
    }
  }
  return <Cb checked={checked} onChange={onChange} />
});

const PlayButton = forwardRef((_, refs) => {
  const [isPlaying, setisPlaying] = useState(false);
  const label = isPlaying ? 'Pause' : 'Play';
  const onClick = () => {
    if (isPlaying) {
      refs.forEach((ref) => ref.current.pause());
    } else {
      refs.forEach((ref) => ref.current.play());
    }
    setisPlaying(!isPlaying)
  };

  return <Button onClick={onClick} variant="contained">{label}</Button>;
});

const App = () => {
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const baseRef = useRef(null);

  return (
    <>
      <p>Test</p>
      {Object.values(audios).map((audio, idx) => <audio key={audio} ref={refs[idx]} src={audio}/>)}
      <audio ref={baseRef} src={audios.e} />
      {refs.map((ref, idx) => <CheckBox key={idx} ref={ref}/>)}
      <PlayButton ref={[...refs, baseRef]}/>
    </>
  );
}

export default App;
