import { useEffect, useState } from "react";
import * as C from "./App.styles";
import logoImage from "./assets/devmemory_logo.png";
import { Button } from "./components/Button";
import { InfoItem } from "./components/InfoItem";
import RestartIcon from "./svgs/restart.svg";
import { GridItemType } from "./types/GridItemType";
import { items } from "./data/items";
import { GridItem } from "./components/GridItem";
import { formatTime } from "./helpers/formatTime";

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [shownCards, setShownCards] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);
  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) {
        setTime(time + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, time]);
  useEffect(() => {
    if (shownCards === 2) {
      let opened = gridItems.filter((item) => item.shown === true);
      if (opened.length === 2) {
        if (opened[0].item === opened[1].item) {
          let tempGrid = [...gridItems];
          for (let i in tempGrid) {
            if (tempGrid[i].shown) {
              tempGrid[i].permanentShown = true;
              tempGrid[i].shown = false;
            }
          }
          setGridItems(tempGrid);
          setShownCards(0);
        } else {
          setTimeout(() => {
            let tempGrid = [...gridItems];
            for (let i in tempGrid) {
              tempGrid[i].shown = false;
            }
            setGridItems(tempGrid);
            setShownCards(0);
          }, 1000);
        }
        setMoves((moves) => moves + 1);
      }
    }
  }, [shownCards, gridItems]);
  useEffect(() => {
    if(moves>0 && gridItems.every(item => item.permanentShown ===true)) {
      setPlaying(false);
    }
  }, [moves, gridItems])

  const resetAndCreateGrid = () => {
    // resetar
    setTime(0);
    setMoves(0);
    setShownCards(0);
    // criar o grid
    let tempGrid: GridItemType[] = [];
    for (let i = 0; i < items.length * 2; i++) {
      tempGrid.push({
        item: null,
        shown: false,
        permanentShown: false,
      });
    }
    // preencher o grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tempGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tempGrid[pos].item = i;
      }
    }
    // colocar o grid no state
    setGridItems(tempGrid);
    // começar o jogo
    setPlaying(true);
  };
  const handleItemClick = (index: number) => {
    if (playing && index !== null && shownCards < 2) {
      let tempGrid = [...gridItems];
      if (tempGrid[index].permanentShown === false && tempGrid[index].shown === false) {
        tempGrid[index].shown = true;
        setShownCards(shownCards + 1);
      }
      setGridItems(tempGrid);
    }
  };
  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="Logo" />
        </C.LogoLink>
        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTime(time)} />
          <InfoItem label="Movimentos" value={moves.toString()} />
        </C.InfoArea>
        <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid} />
      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem key={index} item={item} onClick={() => handleItemClick(index)} />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
};

export default App;
