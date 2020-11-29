

let player_init_pos = []


//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
const place_the_player = (maze,width,height)=>
{
    //here get a random index to place the player inside the maze
    let row = Math.floor(Math.random() * width);
    let col = Math.floor(Math.random() * height);

    let has_player = false;

    while(!has_player)
    {
        row = Math.floor(Math.random() * width);
        col = Math.floor(Math.random() * height);

        // we dont want the plater to spawn in the exit,
        // or inside a wall (ouch!), or in the place where the key is
        if((maze[row][col] !== "E") && 
            (maze[row][col] !== "w") &&
            (maze[row][col] !== "K") ) 
        {
            //place the player in the maze
            maze[row][col] = "P";
            player_init_pos = [row,col];
            has_player = true;
            break;
        }
    }

    //here we surround the player with a walkable path
    //(there is chance that the player spawns trapped between walls)
    let player_pos = [];

    for (let row = 0, row_end = maze.length ; row < row_end; row++)
    {
        for (let col = 0 , col_end = maze[row].length ; col < col_end; col++)
        {
            if(maze[row][col] === "P")
            {
                player_pos.push(row,col);
            }
        }
    }

    let top_left_row = player_pos[0]-1;
    let top_left_col = player_pos[1]-1;

    let bottom_right_row = player_pos[0]+1;
    let bottom_right_col = player_pos[1]+1;

    for (let row = top_left_row ; row <= bottom_right_row; row++)
    {
        for (let col = top_left_col; col <=bottom_right_col; col++)
        {
            if(maze[row][col] !== "P")
            {
                maze[row][col] = 0;
            }
        }
    }
}





//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
const place_the_exit = (maze,width,height)=>
{
    //here get a random index to place the exit
    let col_index = 0;
    let row_index = 0;

    let len = width * 2;
    let has_exit = false;

    for(let i = 0; i < len; i++)
    {
        //this if allows a better distribution
        //of the exit spawn point across the walls of the maze
        if(Math.random() > 0.5)
        {
            col_index = Math.floor(Math.random() * width);
            row_index = Math.floor(Math.random() * height);
        }
        else
        {
            col_index = Math.floor(Math.random() * width+1);
            row_index = Math.floor(Math.random() * height+1);
        }

        //here we check if we are not placing the exit
        //on top of the key, or if we already have placed the exit
        if((maze[row_index][col_index] !== "K") && (!has_exit))
        {
            //place the exit in the walls of the maze
            if((col_index === 0) && (row_index !== 0) )
            {
                maze[row_index][col_index] = "E";
                console.log(" 1 Exit located at :  "+ row_index +  "  ---  "+ col_index);
                has_exit = true;
            }
            else if((row_index === 0) && (col_index !== 0))
            {
                maze[row_index][col_index] = "E";
                console.log(" 2 Exit located at :  "+ row_index +  "  ---  "+ col_index);
                has_exit = true;
            }
            else if((col_index === width) && (row_index !== height))
            {
                maze[row_index][col_index] = "E";
                console.log(" 3 Exit located at :  "+ row_index +  "  ---  "+ col_index);
                has_exit = true;
            }
            else if((row_index === height) && (col_index !== width))
            {
                maze[row_index][col_index] = "E";
                console.log(" 4 Exit located at :  "+ row_index +  "  ---  "+ col_index);
                has_exit = true;
            }
        }

        if(has_exit)
        {
            //here we put walkable space around the exit
            //so it can be reached

            //if the exit has a wall to the left && to the right
            //it means that the exit is on one of the horizontal walls of the maze
            //and we need to put a walkable path (0) in the up or down direction
            try
            {
                if( (maze[row_index][col_index+1] === "w") && 
                (maze[row_index][col_index-1] === "w") )
                {
                    //sometimes one wall is not enough
                    // to reach the exit
                    if(row_index === 0)
                    {
                        maze[row_index+1][col_index] = 0;
                        maze[row_index+2][col_index] = 0;
                    }
                    else if(row_index === height)
                    {
                        maze[row_index-1][col_index] = 0;
                        maze[row_index-2][col_index] = 0;
                    }
                }
            }
            catch(e)
            {
                console.log(e);
            }
            
            //if the exit has a wall up && down of it
            //it means that the exit is on one of the vertical walls of the maze
            //and we need to put a walkable path (0) in the left or right direction
            try
            {
                if( (maze[row_index+1][col_index] === "w") && 
                (maze[row_index-1][col_index] === "w") )
                {
                    //sometimes one wall is not enough to reach the exit
                    if(col_index === 0)
                    {
                        maze[row_index][col_index+1] = 0;
                        maze[row_index][col_index+2] = 0;
                    }
                    else if(col_index === width)
                    {
                        maze[row_index][col_index-1] = 0;
                        maze[row_index][col_index-2] = 0;
                    }
                }
            }
            catch(e)
            {
                console.log(e);
            }

            break;
        }
    }
}




//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
const place_the_key = (maze,width,height)=>
{
    //here get a random index to place the key inside the maze
    let row = Math.floor(Math.random() * width);
    let col = Math.floor(Math.random() * height);

    let has_key = false;

    
    while(!has_key)
    {
        row = Math.floor(Math.random() * width);
        col = Math.floor(Math.random() * height);

        //here we check if the place is occupied by the exit
        //"E" is for the exit
        if(maze[row][col] !== "E") 
        {
            //place the key in the maze
            maze[row][col] = "K";
            has_key = true;
            break;
        }
    }
}








//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
const  GenerateNewMaze = (width, height, placementThreshold)=>
{
    // this will hold the tile references 
    let maze = [];


    //fill the base maze
    for (let row = 0; row < width; row++)
    {
      maze.push([]);

      for (let col = 0; col < height; col++)
      {
        maze[row].push(0);
      }
    }


    let maze_width = width-1;
    let maze_height = height-1;

    //put the maze walls ("w" stands for wall)
    for (let row = 0; row < width; row++)
    {
      
        for (let col = 0; col < height; col++)
        {

            if(row === 0)
            {
                maze[row][col] = "w";
            }
            else if(col === 0)
            {
                maze[row][col] = "w";
            }
            else if(row === maze_width)
            {
                maze[row][col] = "w";
            }
            else if(col === maze_height)
            {
                maze[row][col] = "w";
            }
            else if (row % 2 === 0 && col % 2 === 0)
            {   

                //here we put the inside walls of the maze
                // there is a chance to randomly skip this cell
                // and continue iterating through the array
                if (Math.random() > placementThreshold)
                {
                    //here we put a wall in the current position
                    //and after selecting two random directions (x and y)
                    //we also put a wall there 
                    try
                    {
                        maze[row][col] = "w";
        
                        //choose random direction and put a wall there
                        let a = Math.random() < .5 ? 0 : (Math.random() < .5 ? -1 : 1);
                        let b = a !== 0 ? 0 : (Math.random() < .5 ? -1 : 1);
                        maze[row+a][col+b] = "w";
                    }
                    catch (e)
                    {
                        console.log(e)
                    }
                }
            }
        }
    }

    //this method place the key to exit the maze
    place_the_key(maze,maze_height,maze_height);

    //this method puts the exit of the maze
    //that can only be opened with the key
    place_the_exit(maze,maze_height,maze_height);

    //here we spawn the player inside the maze
    place_the_player(maze,maze_height,maze_height);

    //here we have a playable maze, but it's all references
    //now we need to use those references
    // to put the visual elements so it looks like a real maze
    return maze;
}






