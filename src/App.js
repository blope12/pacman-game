import React, { useState, useEffect, useCallback } from "react";
import wall from "./images/wall.png";
import coin from "./images/coin.png";
import pacmann from "./images/pacman.png";
import bg from "./images/bg.png";
import ghost from "./images/ghost2.png";
import "./index.css";

const PacManGame = () => {
    // State for PacMan position, game map, coin count, and game over status
    const [pacman, setPacman] = useState({ x: 6, y: 4 });
    const [map, setMap] = useState([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 2, 2, 1, 1, 5, 1, 1, 2, 2, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 1, 4, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]);
    const [coinCount, setCoinCount] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Function to handle PacMan movement
    const handleKeyDown = useCallback(
        (event) => {
            if (gameOver) return; // If the game is over, don't handle key events

            const movePacman = (newX, newY) => {
                setMap((prevMap) => {
                    const newMap = [...prevMap];
                    if (newMap[newY][newX] === 2) {
                        setCoinCount(prevCount => prevCount + 1); // Increase coin count
                    }
                    newMap[pacman.y][pacman.x] = 3; // Mark the old position as ground
                    newMap[newY][newX] = 5; // Mark the new position as PacMan
                    return newMap;
                });
                setPacman({ x: newX, y: newY });
            };

            switch (event.keyCode) {
                case 37: // Left arrow
                    if (pacman.x > 0 && map[pacman.y][pacman.x - 1] !== 1) {
                        movePacman(pacman.x - 1, pacman.y);
                    }
                    break;
                case 38: // Up arrow
                    if (pacman.y > 0 && map[pacman.y - 1][pacman.x] !== 1) {
                        movePacman(pacman.x, pacman.y - 1);
                    }
                    break;
                case 39: // Right arrow
                    if (pacman.x < map[0].length - 1 && map[pacman.y][pacman.x + 1] !== 1) {
                        movePacman(pacman.x + 1, pacman.y);
                    }
                    break;
                case 40: // Down arrow
                    if (pacman.y < map.length - 1 && map[pacman.y + 1][pacman.x] !== 1) {
                        movePacman(pacman.x, pacman.y + 1);
                    }
                    break;
                default:
                    break;
            }

            // Check for winning condition after each movement
            checkWinningCondition();
        },
        [pacman, map, gameOver]
    );

    // Function to check for winning condition and collision detection
    const checkWinningCondition = useCallback(() => {
        if (!map.some((row) => row.includes(2))) {
            setGameOver(true);
            alert("Congratulations! You collected all the coins. You win!");
            // Additional logic for restarting the game or other actions
        } else if (!map.some((row) => row.includes(4))) {
            setGameOver(true);
            alert("Game over !! You collided with the ghost");
            // Additional logic for restarting the game or other actions
        }
    }, [map]);

    // Initial rendering
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div id="world">
            {/* Display coin count */}
            <div className="coin-count">
                Coins collected: {coinCount}
            </div>

            {/* Render the game map */}
            {map.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex" }}>
                    {row.map((cell, colIndex) => (
                        <div
                            key={colIndex}
                            className={
                                cell === 1
                                    ? "wall"
                                    : cell === 2
                                    ? "coin"
                                    : cell === 3
                                    ? "ground"
                                    : cell === 4
                                    ? "ghost"
                                    : cell === 5
                                    ? "pacman"
                                    : null
                            }
                            style={{
                                width: "60px",
                                height: "60px",
                                backgroundSize: "cover",
                                backgroundImage:
                                    cell === 1
                                        ? `url(${wall})`
                                        : cell === 2
                                        ? `url(${coin})`
                                        : cell === 3
                                        ? `url(${bg})`
                                        : cell === 4
                                        ? `url(${ghost})`
                                        : cell === 5
                                        ? `url(${pacmann})`
                                        : null,
                            }}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PacManGame;
