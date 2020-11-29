

document.addEventListener("DOMContentLoaded",()=>
{
    // as the name suggests, this file will hold the game logic

    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    const cleanMaze = (mazeData,mazeDiv)=>
    {
        try
        {
            // erase the references of the maze blocks
            // from the div that contains them
            while(mazeDiv.firstChild)
            {
                mazeDiv.removeChild(mazeDiv.firstChild);
            }

            // remove all the divs from the array
            mazeData.length = 0 
        }
        catch(e)
        {}
    }


    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    const drawMaze = (mazeData,maze_size)=>
    {
        //set the custom widt / heigt of the maze grid
        // depending on selected size
        document.getElementById("maze").style.gridTemplateRows = `repeat(${maze_size},1fr)`;
        document.getElementById("maze").style.gridTemplateColumns = `repeat(${maze_size},1fr)`;

        //here we put the css styles corresponding to player,
        // wall, exit and key
        for (let row = 0; row < maze_size; row++)
        {
            for (let col = 0, col_len = mazeData[row].length; col < col_len; col++)
            {
                if(mazeData[row][col] === "P")
                {
                    let player = document.createElement("div");
                    player.classList.add("player");
                    mainMap.appendChild(player);
                    mazeData[row][col] = player;
                }
                else if(mazeData[row][col] === "w")
                {
                    let block = document.createElement("div");
                    block.classList.add("wall");
                    mainMap.appendChild(block);
                    mazeData[row][col] = block;
                }
                else if(mazeData[row][col] === "K")
                {
                    let block = document.createElement("div");
                    block.classList.add("key");
                    mainMap.appendChild(block);
                    mazeData[row][col] = block;
                }
                else if(mazeData[row][col] === "E")
                {
                    let block = document.createElement("div");
                    block.classList.add("exit");
                    mainMap.appendChild(block);
                    mazeData[row][col] = block;
                }
                else if(mazeData[row][col] === 0)
                {
                    let block = document.createElement("div");
                    block.classList.add("path");
                    mainMap.appendChild(block);
                    mazeData[row][col] = block;
                }
            }  
        }

    }


    //---------------------------------------------------------------------
    //---------------------------------------------------------------------

    
    //get the div to put the elements inside it
    let mainMap = document.getElementById("maze");
    
    // here we generate the maze reference data
    let newMazeData = [];
    
    let btn_generate_maze = document.querySelector(".btn_new_maze");

    let playerPos = [];

    let hasKey = false;

    let isMazeReady = false;
    

    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    btn_generate_maze.addEventListener("click",()=>
    {
        let radiobtn_hard = document.getElementById("hard");

        //will hold the selected maze size
        let maze_size = 40;
        
        //@ts-ignore
        if(radiobtn_hard.checked)
        {
            maze_size = 70;
        }

        cleanMaze(newMazeData,mainMap);
        newMazeData =  GenerateNewMaze(maze_size,maze_size,0.02);
        playerPos = player_init_pos;
        drawMaze(newMazeData,maze_size);

        isMazeReady = true;
    })


    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    const movePlayer = (direction)=>
    {
        if(isMazeReady)
        {
            let newPos = 0;
            let currCell = newMazeData[playerPos[0]][playerPos[1]];
            let cellToMove = [];
            let axisToChange = 0;

            if(direction === "Up")
            {
                newPos = playerPos[0]
                newPos-=1;
                cellToMove = newMazeData[newPos][playerPos[1]];
                axisToChange = 0;

            }
            else if(direction ==="Left")
            {
                newPos = playerPos[1]
                newPos -=1;
                cellToMove = newMazeData[playerPos[0]][newPos];
                axisToChange = 1;
            }
            else if(direction === "Down")
            {
                newPos = playerPos[0]
                newPos +=1;
                cellToMove = newMazeData[newPos][playerPos[1]];
                axisToChange = 0;

            }
            else if(direction === "Right")
            {
                newPos = playerPos[1]
                newPos +=1;
                cellToMove = newMazeData[playerPos[0]][newPos];
                axisToChange = 1;
            }

            // here we check if the player has collided with
            // a wall, the key or the exit
            if(cellToMove.classList.contains("wall"))
            {
                return;
            }
            else if(cellToMove.classList.contains("path"))
            {
                try
                {
                    currCell.classList.remove("player");
                    currCell.classList.add("path");

                    playerPos[axisToChange] = newPos;
                    
                    cellToMove.classList.remove("path");
                    cellToMove.classList.add("player");
                }
                catch(e)
                {}
            }
            else if(cellToMove.classList.contains("key"))
            {
                currCell.classList.remove("player");
                currCell.classList.add("path");

                playerPos[axisToChange] = newPos;

                cellToMove.classList.remove("key");
                cellToMove.classList.add("player");
                hasKey = true;
            }
            else if(cellToMove.classList.contains("exit"))
            {
                if(hasKey)
                {
                    currCell.classList.remove("player");
                    currCell.classList.add("path");

                    playerPos[axisToChange] = newPos;
                    
                    cellToMove.classList.remove("exit");
                    cellToMove.classList.add("player");
                    alert("you win!");
                    //@ts-ignore
                    btn_generate_maze.click();
                }
                else
                {
                    alert("you need the key to open the exit door!");
                    return;
                }
            }
        }

    }


    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    const userInput = (e)=>
    {
        switch (e.keyCode)
        {
            // w  --- up
            case 87:
                movePlayer("Up");          
            break;

            // a --- left
            case 65:
                movePlayer("Left");
            break;

            // s --- down
            case 83:
                movePlayer("Down");
            break;

            // d --- right
            case 68:
                movePlayer("Right");
            break;

            default:
            break;
        }
    }

    document.addEventListener("keydown",userInput);

});