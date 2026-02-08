import React from "react";

export default function Popup() {
  return (
    <div style={{ padding: 16, width: 250 }}>
      <h2>ExtSpeed</h2>
      <p>Extensão para controlar a velocidade dos vídeos do YouTube.</p>
      <ul>
        <li>Arraste o controle para reposicionar.</li>
        <li>Use + e - para ajustar a velocidade.</li>
        <li>Duplo clique na velocidade para resetar.</li>
      </ul>
      <small>Desenvolvido por kronyer</small>
    </div>
  );
}