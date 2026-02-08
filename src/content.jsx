import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";


const SpeedControl = ({ visible, setVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [position, setPosition] = useState({ x: 10, y: 60 }); // Começa mais para baixo
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

  const handleResetSpeed = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSpeed(1);
  };


  useEffect(() => {
    updateVideoSpeed(speed);
  }, [speed]);

  // Sincroniza o controle quando o vídeo muda por atalho
  useEffect(() => {
    function handleSpeedSync(e) {
      if (e && e.detail && typeof e.detail === 'number') {
        setSpeed(e.detail);
      } else {
        // fallback: pega do vídeo
        const video = document.querySelector("video");
        if (video) setSpeed(video.playbackRate);
      }
    }
    window.addEventListener("extspeed-sync-speed", handleSpeedSync);
    return () => window.removeEventListener("extspeed-sync-speed", handleSpeedSync);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]); // Dependência de isDragging para garantir que os eventos sejam atualizados

  if (!visible) return null;
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
        onDoubleClick={handleResetSpeed}
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


// Tenta injetar o controle, com logs detalhados e tentativas múltiplas

// Estado global para visibilidade do controle
let speedControlVisible = true;
let setSpeedControlVisible = null;

const injectControls = (retryCount = 0) => {
  console.log(`[injectControls] Tentando injetar controles (tentativa ${retryCount})`);
  const videoPlayer = document.querySelector(".html5-video-container");
  const video = document.querySelector("video");

  if (!videoPlayer) {
    console.log("[injectControls] .html5-video-container NÃO encontrado");
    if (retryCount < 10) {
      setTimeout(() => injectControls(retryCount + 1), 500);
    }
    return;
  }
  if (!video) {
    console.log("[injectControls] <video> NÃO encontrado");
    if (retryCount < 10) {
      setTimeout(() => injectControls(retryCount + 1), 500);
    }
    return;
  }

  // Verifica se a div de controles já existe
  let controlsDiv = document.querySelector("#speed-control-div");
  if (controlsDiv) {
    console.log("[injectControls] Div de controles já existe. Removendo...");
    try {
      videoPlayer.removeChild(controlsDiv);
    } catch (e) {
      console.log("[injectControls] Erro ao remover div antiga:", e);
    }
  }

  // Cria uma nova div de controles
  controlsDiv = document.createElement("div");
  controlsDiv.id = "speed-control-div";
  videoPlayer.appendChild(controlsDiv);

  try {
    const root = createRoot(controlsDiv);
    // Componente wrapper para controlar visibilidade
    function Wrapper() {
      const [visible, setVisible] = useState(speedControlVisible);
      useEffect(() => {
        setSpeedControlVisible = setVisible;
      }, []);
      return <SpeedControl visible={visible} setVisible={setVisible} />;
    }
    root.render(<Wrapper />);
    console.log("[injectControls] Controle de velocidade injetado com sucesso!");
  } catch (e) {
    console.log("[injectControls] Erro ao renderizar SpeedControl:", e);
  }
};


// Tenta injetar controles quando o vídeo estiver pronto
function checkAndInjectControls() {
  console.log("[checkAndInjectControls] Checando elemento de vídeo");
  const interval = setInterval(() => {
    const video = document.querySelector("video");
    if (video) {
      if (video.readyState >= 2) {
        // Vídeo já pode ser reproduzido
        injectControls();
        clearInterval(interval);
      } else {
        // Espera o evento canplay
        video.addEventListener("canplay", () => {
          injectControls();
        }, { once: true });
        clearInterval(interval);
      }
    }
  }, 500);
}


// Função para observar mudanças de vídeo (SPA/playlist)

function observeVideoChanges() {
  let lastVideoId = null;
  let lastHref = location.href;
  let lastPlayer = null;

  function getVideoId() {
    const url = new URL(window.location.href);
    return url.searchParams.get("v");
  }

  function tryInject(force = false) {
    const currentId = getVideoId();
    const videoPlayer = document.querySelector(".html5-video-container");
    const video = document.querySelector("video");
    const controlsDiv = document.querySelector("#speed-control-div");

    console.log(`[observeVideoChanges] tryInject: currentId=${currentId}, lastVideoId=${lastVideoId}, force=${force}`);
    if (force || (currentId && currentId !== lastVideoId)) {
      lastVideoId = currentId;
      checkAndInjectControls();
    } else if (videoPlayer && !controlsDiv && video) {
      // Se o vídeo mudou mas o controle sumiu, tenta reinjetar
      console.log("[observeVideoChanges] Controle sumiu, reinjetando!");
      checkAndInjectControls();
    }
  }

  // Observa mudanças no body (YouTube SPA)
  const observer = new MutationObserver(() => {
    tryInject();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Observa mudanças de URL (history API)
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      tryInject(true);
    }
  }, 500);

  // Observa mudanças no player (casos de playlist)
  setInterval(() => {
    const player = document.querySelector(".html5-video-container");
    if (player !== lastPlayer) {
      lastPlayer = player;
      console.log("[observeVideoChanges] Player container mudou, tentando reinjetar");
      tryInject(true);
    }
  }, 1000);

  // Primeira injeção
  tryInject(true);
}


// Atalhos de teclado globais
window.addEventListener("keydown", (e) => {
  // Ignora se está digitando em input/textarea
  if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  if (e.repeat) return;
  if (e.key === "d" || e.key === "D") {
    // Aumenta velocidade
    const video = document.querySelector("video");
    if (video) {
      let newSpeed = Math.min(video.playbackRate + 0.25, 10);
      video.playbackRate = newSpeed;
      // Atualiza controle visual
      window.dispatchEvent(new CustomEvent("extspeed-sync-speed", { detail: newSpeed }));
      if (setSpeedControlVisible) setSpeedControlVisible(true);
    }
    e.preventDefault();
  } else if (e.key === "s" || e.key === "S") {
    // Diminui velocidade
    const video = document.querySelector("video");
    if (video) {
      let newSpeed = Math.max(video.playbackRate - 0.25, 0.25);
      video.playbackRate = newSpeed;
      window.dispatchEvent(new CustomEvent("extspeed-sync-speed", { detail: newSpeed }));
      if (setSpeedControlVisible) setSpeedControlVisible(true);
    }
    e.preventDefault();
  } else if (e.key === "v" || e.key === "V") {
    // Esconde/mostra controle
    speedControlVisible = !speedControlVisible;
    if (setSpeedControlVisible) setSpeedControlVisible(speedControlVisible);
    e.preventDefault();
  }
});

observeVideoChanges();
