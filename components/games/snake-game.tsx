"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const COLUMNS = 18;
const ROWS = 14;
const initialSnake: Point[] = [
  { x: 8, y: 7 },
  { x: 7, y: 7 },
  { x: 6, y: 7 },
];

const directionVectors: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const opposites: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function nextFruit(snake: Point[], offset = 0): Point {
  for (let attempt = 0; attempt < COLUMNS * ROWS; attempt += 1) {
    const index = (attempt * 47 + snake.length * 23 + offset * 19) % (COLUMNS * ROWS);
    const candidate = { x: index % COLUMNS, y: Math.floor(index / COLUMNS) };
    if (!snake.some((part) => part.x === candidate.x && part.y === candidate.y)) return candidate;
  }
  return { x: 2, y: 2 };
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [fruit, setFruit] = useState<Point>(() => nextFruit(initialSnake));
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const directionRef = useRef<Direction>("right");
  const requestedDirectionRef = useRef<Direction>("right");

  const setDirection = useCallback((direction: Direction) => {
    if (opposites[directionRef.current] === direction) return;
    requestedDirectionRef.current = direction;
    setRunning(true);
  }, []);

  const restart = useCallback(() => {
    directionRef.current = "right";
    requestedDirectionRef.current = "right";
    setSnake(initialSnake);
    setFruit(nextFruit(initialSnake));
    setScore(0);
    setGameOver(false);
    setRunning(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, Direction | undefined> = {
        ArrowUp: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right",
      };
      const direction = keyMap[event.key];
      if (!direction) return;
      event.preventDefault();
      setDirection(direction);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setDirection]);

  useEffect(() => {
    if (!running || gameOver) return;
    const timer = window.setInterval(() => {
      setSnake((current) => {
        directionRef.current = requestedDirectionRef.current;
        const vector = directionVectors[directionRef.current];
        const head = {
          x: current[0].x + vector.x,
          y: current[0].y + vector.y,
        };
        const hitWall = head.x < 0 || head.x >= COLUMNS || head.y < 0 || head.y >= ROWS;
        const hitSelf = current.some((part) => part.x === head.x && part.y === head.y);

        if (hitWall || hitSelf) {
          setGameOver(true);
          setRunning(false);
          return current;
        }

        const ate = head.x === fruit.x && head.y === fruit.y;
        const updated = [head, ...current];
        if (ate) {
          setScore((value) => value + 10);
          setFruit(nextFruit(updated, score + 1));
          return updated;
        }
        updated.pop();
        return updated;
      });
    }, Math.max(78, 145 - score * 1.6));
    return () => window.clearInterval(timer);
  }, [fruit, gameOver, running, score]);

  return (
    <div className="game-shell snake-game">
      <div className="game-meta">
        <span>SCORE / {String(score).padStart(3, "0")}</span>
        <span>{gameOver ? "SIGNAL LOST" : running ? "RUNNING" : "READY"}</span>
      </div>

      <div className="snake-board" role="img" aria-label={`Snake game board. Score ${score}`}>
        {Array.from({ length: COLUMNS * ROWS }, (_, index) => {
          const x = index % COLUMNS;
          const y = Math.floor(index / COLUMNS);
          const snakeIndex = snake.findIndex((part) => part.x === x && part.y === y);
          const isFruit = fruit.x === x && fruit.y === y;
          return (
            <i
              key={index}
              className={`${snakeIndex === 0 ? "snake-head" : snakeIndex > 0 ? "snake-body" : ""} ${isFruit ? "snake-fruit" : ""}`}
            />
          );
        })}
        {!running && (
          <button type="button" className="game-overlay" onClick={gameOver ? restart : () => setRunning(true)}>
            <strong>{gameOver ? "GAME OVER" : "SNAKE_01"}</strong>
            <span>{gameOver ? "Tap to restart" : "Tap or press an arrow to play"}</span>
          </button>
        )}
      </div>

      <div className="game-controls" aria-label="Snake controls">
        <span />
        <button type="button" aria-label="Move up" onClick={() => setDirection("up")}><ArrowUp /></button>
        <span />
        <button type="button" aria-label="Move left" onClick={() => setDirection("left")}><ArrowLeft /></button>
        <button type="button" aria-label="Restart game" onClick={restart}><RotateCcw /></button>
        <button type="button" aria-label="Move right" onClick={() => setDirection("right")}><ArrowRight /></button>
        <span />
        <button type="button" aria-label="Move down" onClick={() => setDirection("down")}><ArrowDown /></button>
        <span />
      </div>
    </div>
  );
}
