"use client";

import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type GameState = {
  width: number;
  height: number;
  leftY: number;
  rightY: number;
  ballX: number;
  ballY: number;
  velocityX: number;
  velocityY: number;
};

function resetBall(game: GameState, direction: 1 | -1) {
  game.ballX = game.width / 2;
  game.ballY = game.height / 2;
  game.velocityX = direction * Math.max(185, game.width * 0.43);
  game.velocityY = (Math.random() > 0.5 ? 1 : -1) * 125;
}

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>({
    width: 640,
    height: 320,
    leftY: 125,
    rightY: 125,
    ballX: 320,
    ballY: 160,
    velocityX: 210,
    velocityY: 130,
  });
  const [score, setScore] = useState({ player: 0, cpu: 0 });

  const movePlayer = useCallback((amount: number) => {
    const game = gameRef.current;
    game.leftY = Math.max(8, Math.min(game.height - 78, game.leftY + amount));
  }, []);

  const restart = useCallback(() => {
    setScore({ player: 0, cpu: 0 });
    const game = gameRef.current;
    game.leftY = game.height / 2 - 35;
    game.rightY = game.height / 2 - 35;
    resetBall(game, 1);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const game = gameRef.current;
    const paddleWidth = 9;
    const paddleHeight = 70;
    const ballSize = 9;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      game.width = Math.max(280, bounds.width);
      game.height = Math.max(210, bounds.height);
      canvas.width = Math.round(game.width * dpr);
      canvas.height = Math.round(game.height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      game.leftY = Math.min(game.leftY, game.height - paddleHeight - 8);
      game.rightY = Math.min(game.rightY, game.height - paddleHeight - 8);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "w", "W", "s", "S"].includes(event.key)) event.preventDefault();
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") movePlayer(-25);
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") movePlayer(25);
    };
    window.addEventListener("keydown", onKeyDown);

    let animationFrame = 0;
    let previous = performance.now();
    const draw = (now: number) => {
      animationFrame = window.requestAnimationFrame(draw);
      const delta = Math.min(0.028, (now - previous) / 1000);
      previous = now;

      game.ballX += game.velocityX * delta;
      game.ballY += game.velocityY * delta;

      if (game.ballY <= ballSize || game.ballY >= game.height - ballSize) {
        game.velocityY *= -1;
        game.ballY = Math.max(ballSize, Math.min(game.height - ballSize, game.ballY));
      }

      const cpuTarget = game.ballY - paddleHeight / 2;
      game.rightY += Math.sign(cpuTarget - game.rightY) * Math.min(Math.abs(cpuTarget - game.rightY), 155 * delta);
      game.rightY = Math.max(8, Math.min(game.height - paddleHeight - 8, game.rightY));

      const hitLeft = game.ballX <= 26 + paddleWidth && game.ballX >= 18 && game.ballY >= game.leftY && game.ballY <= game.leftY + paddleHeight;
      const hitRight = game.ballX >= game.width - 26 - paddleWidth && game.ballX <= game.width - 18 && game.ballY >= game.rightY && game.ballY <= game.rightY + paddleHeight;
      if (hitLeft && game.velocityX < 0) {
        game.velocityX = Math.abs(game.velocityX) * 1.035;
        game.velocityY += (game.ballY - (game.leftY + paddleHeight / 2)) * 2.4;
      }
      if (hitRight && game.velocityX > 0) {
        game.velocityX = -Math.abs(game.velocityX) * 1.035;
        game.velocityY += (game.ballY - (game.rightY + paddleHeight / 2)) * 2.15;
      }

      if (game.ballX < -20) {
        setScore((value) => ({ ...value, cpu: value.cpu + 1 }));
        resetBall(game, 1);
      }
      if (game.ballX > game.width + 20) {
        setScore((value) => ({ ...value, player: value.player + 1 }));
        resetBall(game, -1);
      }

      context.clearRect(0, 0, game.width, game.height);
      context.fillStyle = "#070710";
      context.fillRect(0, 0, game.width, game.height);
      context.strokeStyle = "rgba(155, 129, 255, 0.24)";
      context.setLineDash([6, 10]);
      context.beginPath();
      context.moveTo(game.width / 2, 12);
      context.lineTo(game.width / 2, game.height - 12);
      context.stroke();
      context.setLineDash([]);

      context.shadowBlur = 18;
      context.shadowColor = "#9b81ff";
      context.fillStyle = "#a78bfa";
      context.fillRect(18, game.leftY, paddleWidth, paddleHeight);
      context.shadowColor = "#66e5ff";
      context.fillStyle = "#66e5ff";
      context.fillRect(game.width - 27, game.rightY, paddleWidth, paddleHeight);
      context.shadowColor = "#ffffff";
      context.fillStyle = "#ffffff";
      context.fillRect(game.ballX - ballSize / 2, game.ballY - ballSize / 2, ballSize, ballSize);
      context.shadowBlur = 0;
    };
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", onKeyDown);
      resizeObserver.disconnect();
    };
  }, [movePlayer]);

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const game = gameRef.current;
    game.leftY = Math.max(8, Math.min(game.height - 78, event.clientY - bounds.top - 35));
  };

  return (
    <div className="game-shell pong-game">
      <div className="game-meta">
        <span>YOU / {String(score.player).padStart(2, "0")}</span>
        <span>CPU / {String(score.cpu).padStart(2, "0")}</span>
      </div>
      <canvas
        ref={canvasRef}
        onPointerMove={onPointerMove}
        className="pong-canvas"
        aria-label={`Pong game. You ${score.player}, computer ${score.cpu}`}
      />
      <div className="pong-controls">
        <button type="button" onPointerDown={() => movePlayer(-28)} aria-label="Move paddle up"><ArrowUp /></button>
        <button type="button" onClick={restart} aria-label="Restart Pong"><RotateCcw /></button>
        <button type="button" onPointerDown={() => movePlayer(28)} aria-label="Move paddle down"><ArrowDown /></button>
      </div>
      <p className="game-hint">Move with W/S, arrow keys, pointer, or touch controls.</p>
    </div>
  );
}
