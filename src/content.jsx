import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const SpeedControl = () => {
  const [speed, setSpeed] = useState(1);

  const increaseSpeed = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSpeed((prevSpeed) => {
      const newSpeed = Math.min(prevSpeed + 0.25, 10);
      updateVideoSpeed(newSpeed);
      return newSpeed;
    });
  };

  const decreaseSpeed = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSpeed((prevSpeed) => {
      const newSpeed = Math.max(prevSpeed - 0.25, 0.25);
      updateVideoSpeed(newSpeed);
      return newSpeed;
    });
  };

  const updateVideoSpeed = (newSpeed) => {
    const video = document.querySelector("video");
    if (video) {
      console.log(`Updating video speed to ${newSpeed}`); // Log do valor atualizado da velocidade
      video.playbackRate = newSpeed;
    } else {
      console.log("No video element found"); // Log se o elemento de vídeo não for encontrado
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }; // 300 ms debounce time

  useEffect(() => {
    updateVideoSpeed(speed);
  }, [speed]);

  return (
    <div style={styles.container}>
      <button
        onClick={decreaseSpeed}
        onDoubleClick={handleDoubleClick}
        style={styles.button}
      >
        -
      </button>
      <span style={styles.speedText}>{speed}x</span>
      <button
        onClick={increaseSpeed}
        onDoubleClick={handleDoubleClick}
        style={styles.button}
      >
        +
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    width: "13rem",
    justifyContent: "center",
  },
  button: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    padding: "0 10px",
  },
  speedText: {
    fontSize: "18px",
    margin: "0 10px",
  },
};

const injectControls = () => {
  console.log("Injecting controls"); // Log quando injetar os controles
  const videoPlayer = document.querySelector(".html5-video-container");
  if (videoPlayer) {
    console.log("PM Video player ENCONTRADO"); // Log se o contêiner do player de vídeo não for encontrado

    const controlsDiv = document.createElement("div");
    videoPlayer.appendChild(controlsDiv);

    const root = createRoot(controlsDiv);
    root.render(<SpeedControl />);
  } else {
    console.log("PM Video player container not found"); // Log se o contêiner do player de vídeo não for encontrado
  }
};

function checkAndInjectControls() {
  console.log("checando");
  const interval = setInterval(() => {
    console.log("checando 1s");

    const videoContainer = document.querySelector(".html5-video-container");
    if (videoContainer) {
      console.log("achou");

      injectControls();
      clearInterval(interval);
    }
  }, 1000); // Verifica a cada 1 segundo
}

checkAndInjectControls();
