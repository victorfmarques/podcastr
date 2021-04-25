import {createContext, useState, ReactNode, useContext} from 'react'

type Episode = {
     title: string;
     members: string;
     thumbnail: string;
     duration: number;
     url: string;
};

type PlayerContextData = {
     episodeList: Array<Episode>;
     currentEpisodeIndex: number;
     isPlaying: boolean;
     isLooping: boolean;
     isShuffling: boolean;
     play: (episode:Episode) => void;
     playList: (list:Array<Episode>, index: number) => void;
     togglePlay: () => void;
     toggleLoop: () => void;
     toggleShuffle: () => void;
     setPlayingState: (state: boolean) => void;
     clearPlayerState: () => void;
     playNext: () => void;
     playPrevious: () => void;
     hasNext: boolean;
     hasPrevious: boolean;
}

type PlayerContextProviderProps = {
     children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export const PlayerContextProvider = ({children}: PlayerContextProviderProps) => {
     
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode:Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

 
  function playList(list: Array<Episode>, index: number){
       setEpisodeList(list);
       setCurrentEpisodeIndex(index)
       setIsPlaying(true);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  function clearPlayerState(){
       setEpisodeList([])
       setCurrentEpisodeIndex(0)
  }

  const hasPrevious = currentEpisodeIndex > 0;

  const hasNext = isShuffling || ((currentEpisodeIndex + 1) < episodeList.length)

  function playNext(){      
     if (isShuffling) {
          const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
          setCurrentEpisodeIndex(nextRandomEpisodeIndex)
     }
     else if (hasNext){
          setCurrentEpisodeIndex(currentEpisodeIndex + 1)
     }
  }

  function playPrevious(){
     if (hasPrevious){
        setCurrentEpisodeIndex(currentEpisodeIndex - 1)
     }
}

function toggleLoop(){
     setIsLooping(!isLooping)
}

function toggleShuffle(){
     setIsShuffling(!isShuffling)
}

  return(
     <PlayerContext.Provider 
          value={{
               episodeList,
               currentEpisodeIndex,
               play,
               playList,
               togglePlay,
               toggleLoop,
               toggleShuffle,
               isPlaying,
               isLooping,
               isShuffling,
               setPlayingState,
               clearPlayerState,
               playNext,
               playPrevious,
               hasNext,
               hasPrevious
          }}
          >
          {children}
     </PlayerContext.Provider>
  )
}

// Utilizar para importar context nas pages (Bug => não reconhecendo as vars do context)
export const usePlayer = () => {
     return useContext(PlayerContext);
}