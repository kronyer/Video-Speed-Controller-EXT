import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

const SpeedControl = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const styles = {
    container: {
      position: "absolute",
      top: position.y + "px",
      left: position.x + "px",
      background: isHovered ? "rgba(0, 0, 0, 0.5)" : "rgba(0,0,0,0.1)",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      width: "13rem",
      height: "2rem",
      justifyContent: "center",
      cursor: isDragging ? "grabbing" : "grab",
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
      width: "33%",
      textAlign: "center",
    },
  };

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
      video.playbackRate = newSpeed;
    } else {
      console.log("No video element found");
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const videoElement = document.querySelector("video");
      const videoRect = videoElement.getBoundingClientRect();

      const remToPx = (rem) =>
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const controlWidth = remToPx(parseFloat(styles.container.width));

      let newX = e.clientX - dragStart.current.x;
      if (newX < 0) {
        newX = 0;
      }
      if (newX > videoRect.width - controlWidth) {
        newX = videoRect.width - controlWidth;
      }

      let newY = e.clientY - dragStart.current.y;
      if (newY < 0) {
        newY = 0;
      }
      if (newY > videoRect.height - 100) {
        newY = videoRect.height - 100;
      }
      setPosition({ x: newX, y: newY });
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMissClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    updateVideoSpeed(speed);
  }, [speed]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]); // Dependência de isDragging para garantir que os eventos sejam atualizados

  return (
    <div
      onClick={handleMissClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      style={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onDoubleClick={handleDoubleClick}
        onClick={decreaseSpeed}
        style={styles.button}
      >
        -
      </button>
      <span
        onClick={handleMissClick}
        onDoubleClick={handleDoubleClick}
        style={styles.speedText}
      >
        {speed}x
      </span>
      <button
        onDoubleClick={handleDoubleClick}
        onClick={increaseSpeed}
        style={styles.button}
      >
        +
      </button>
    </div>
  );
};

const injectControls = () => {
  console.log("Injecting controls");
  const videoPlayer = document.querySelector(".html5-video-container");

  if (videoPlayer) {
    console.log("Video player container found");

    // Verifica se a div de controles já existe
    let controlsDiv = document.querySelector("#speed-control-div");

    // Se a div já existe, removê-la
    if (controlsDiv) {
      console.log("Existing controls div found. Removing...");
      videoPlayer.removeChild(controlsDiv);
    }

    // Cria uma nova div de controles
    controlsDiv = document.createElement("div");
    controlsDiv.id = "speed-control-div"; // Define um id para fácil referência futura
    videoPlayer.appendChild(controlsDiv);

    const root = createRoot(controlsDiv);
    root.render(<SpeedControl />);
  } else {
    console.log("Video player container not found");
  }
};

function checkAndInjectControls() {
  console.log("Checking for video container");
  const interval = setInterval(() => {
    console.log("Checking every 1s");

    const videoContainer = document.querySelector(".html5-video-container");
    if (videoContainer) {
      console.log("Video container found");

      injectControls();
      clearInterval(interval);
    }
  }, 1000);
}

checkAndInjectControls();
