"use strict";
function solve() {	
	var dimension = 9; //dimension of the sudoku board
	var givens = [];
	var ctr = 0;
	var val = 0;
	var key = "";
	var finished = false;
	var curR = 0;
	var curC = 0;
	var curVal = 0;
	var curNum = 0;
	var bin;
	var backtrack = false;
	var temp;

	alert("hi");
	var curBoard = new Array(dimension); //creates the sudoku board using a 2D array
	for (var i = 0; i < dimension; i++) {
		curBoard[i] = new Array(dimension);
	}

	var inputs = document.getElementsByTagName("input"); //gets all the input number and adds into an array
	for (var j = 0; j < inputs.length; j++) {
		if (inputs[j].getAttribute('type') == 'number') {
			if (inputs[j].value == "") { //if no given in that cell, 0 is added to preserve coordinates
				givens.push(0);
			}
			else {
				givens.push(inputs[j].value);
			}
		}
	}

	for (var r = 0; r < dimension; r++) { //updates the 2D array board with the givens
		for (var c = 0; c < dimension; c++) {
			curBoard[r][c] = givens[ctr];
			ctr++;
		}
	}

	//creates the hashmap of possibilities where the key represents the cell coordinate
	//and the value is a decimal number which represents the possibilities
	//for example: if 1, 4 and 7 are possible then the value is 2^0 + 2^3 + 2^7 (2 ^ number - 1)
	var possibleMap = {};
	var defaultPossibilities = {}; //hashmap of possibilities using only the givens

	//populates the default possibilities hashmap
	for (var r = 0; r < dimension; r++) { //updates the 2D array board with the givens
		for (var c = 0; c < dimension; c++) {
			if (curBoard[r][c] != 0) { //if the cell was a given, there are no other possibilities
				defaultPossibilities[r + "," + c] = 0;
			}
			else {
				for (var i = 1; i < 10; i++) { //checks whether the numbers 1-9 are possible in that cell
					if (checkRow(r, c, i, curBoard) && checkCol(r, c, i, curBoard) && checkBlock(r, c, i, curBoard)) { //number is a possibility
						val = val + Math.pow(2, i-1);
					}
				}

				defaultPossibilities[r + "," + c] = val; //inputs the possibility into hashmap
				val = 0; //resets the value for the next key,value pair (cell)
			}
		}
	}

	 //copies default hashmap into the updated/possible hashmap because they are the same initially
	possibleMap = jQuery.extend({}, defaultPossibilities);

	//solves the sudoku puzzle
	while (!finished) {
		curNum = 1; //resets the number
		curVal = possibleMap[curR + "," + curC];
		var def = defaultPossibilities[curR + "," + curC];

		if (defaultPossibilities[curR + "," + curC] == 0) { //checks if cell is a given number
			if (backtrack) { //currently trying to backtrack so we must go to previous cell 
				//sets the coordinates to the previous cell
				if (curC == 0) { //previous cell was in the row above
					if (curR == 0) { //currently at the first cell
						alert("No Solution!");
						return -1;
					}
					curR--;
					curC = dimension - 1;
				}
				else {
					curC--;
				}
			}
			else { //currently going forward so we must advance to the next cell
				if (curC == 8) { //at the end of a row so we must go down a row
					if (curR == 8) { //we are at the last cell and the puzzle is complete
						finished = true; 
						continue;
					}

					curC = 0;
					curR++;
				}
				else {
					curC++;
				}
			}
		}

		else if (curVal != 0) { //there are still possibilities for this cell
			backtrack = false;
			bin = curVal.toString(2); //converts the value which is in decimal to binary
			bin = reverse(bin);

			for (var i = 0; i < 9; i++) { //finds the next possible number
				if (bin.charAt(i) == '1') { // the number i+1 is a possibility
					curNum = i + 1;
					possibleMap[curR + "," + curC] = curVal - Math.pow(2, i); //removes the possibility after it is chosen
					break;
				}
			}

			//checks to make sure the number is still a valid option
			if (checkRow(curR, curC, curNum, curBoard) && checkCol(curR, curC, curNum, curBoard) && checkBlock(curR, curC, curNum, curBoard)) {
				//adds it to the board 
				curBoard[curR][curC] = curNum;
				document.getElementsByName((curR + 1) + "" + (curC + 1))[0].value = curNum;


				//advances to the next cell
				if (curC == 8) { //at the end of a row so we must go down a row
					if (curR == 8) { //we are at the last cell and the puzzle is complete
						finished = true; 
						continue;
					}

					curC = 0;
					curR++;
				}
				else {
					curC++;
				}
			}

		}

		else { //cell has no possibilities and is not a given so we must backtrack
			//the current cell with no options is reverted back to its default state
			possibleMap[curR + "," + curC] = defaultPossibilities[curR + "," + curC];
			backtrack = true;
			curBoard[curR][curC] = 0; //sets the cell back to empty
			document.getElementsByName((curR + 1) + "" + (curC + 1))[0].value = "";

			//sets the coordinates to the previous cell
			if (curC == 0) { //previous cell was in the row above
				if (curR == 0) { //currently at the first cell
					alert("No Solution!");
					return -1;
				}
				curR--;
				curC = dimension - 1;
			}
			else {
				curC--;
			}
		}
	}
	return false;
}

function reverse(str) { //reverses strings/binary number strings to have the most significant bit as the last char
    return str.split('').reverse().join('');
}

function checkRow(row, col, number, curBoard) { //checks if any of the cells in the same row contain the same number
	for (var p = 0; p < 9; p++) {
		if (p != col) { //not the cell we are checking for
			if (curBoard[row][p] == number) { //number is not a valid option
				return false;
			}
		}
	}
	return true; //number was not found in the same row, it is a valid option
}

function checkCol(row, col, number, curBoard) { //checks if any of the cells in the same column contain the same number
	for (var p = 0; p < 9; p++) {
		if (p != row) { //not the cell we are checking for
			if (curBoard[p][col] == number) { //number is not a valid option
				return false;
			}
		}
	}
	return true; //number was not found in the same column, it is a valid option
}

function checkBlock(row, col, number, curBoard) { //checks if any of the cells in the same block contain the same number
	//must figure out which block it is in

	if (row < 3 && col < 3) { //block 1
		//check all blocks with coordinates (0-2, 0-2)
		for (var t = 0; t < 3; t++) {
			for (var u = 0; u < 3; u++) {
				if ((t != row) && (u != col)) { //not the same coordinates as the cell we're checking
					if (curBoard[t][u] == number) { //number is not a valid option
						return false;
					}
				}
			}
		}

		return true; //number was not found in the same block, it is a valid option
	}
	else if (row < 3 && col < 6) { //block 2
		//check all blocks with coordinates (0-2, 3-5)
		for (var t = 0; t < 3; t++) {
			for (var u = 3; u < 6; u++) {
				if ((t != row) && (u != col)) { //not the same coordinates as the cell we're checking
					if (curBoard[t][u] == number) { //number is not a valid option
						return false;
					}
				}
			}
		}

		return true; //number was not found in the same block, it is a valid option
	}
	else if (row < 3 && col < 9) { //block 3
		//check all blocks with coordinates (0-2, 6-8)
		for (var t = 0; t < 3; t++) {
			for (var u = 6; u < 9; u++) {
				if ((t != row) && (u != col)) { //not the same coordinates as the cell we're checking
					if (curBoard[t][u] == number) { //number is not a valid option
						return false;
					}
				}
			}
		}

		return true; //number was not found in the same block, it is a valid option
	}
	else if (row < 6 && col < 3) { //block 4
		//check all blocks with coordinates (3-5, 0-2)
		for (var t = 3; t < 6; t++) {
			for (var u = 0; u < 3; u++) {
				if ((t != row) && (u != col)) { //not the same coordinates as the cell we're checking
					if (curBoard[t][u] == number) { //number is not a valid option
						return false;
					}
				}
			}
		}

		return true; //number was not found in the same block, it is a valid option
	}
	else if (row < 6 && col < 6) { //block 5
		//check all blocks with coordinates (3-5, 3-5)
		for (var t = 3; t < 6; t++) {
			for (var u = 3; u < 6; u++) {
				if ((t != row) && (u != col)) { //not the same coordinates as the cell we're checking
					if (curBoard[t][u] == number) { //number is not a valid option
						return false;
					}
				}
			}
		}

		return true; //number was not found in the same block, it is a valid option
	}
	else if (row < 6 && col < 9) { //block 6
		//check all blocks with coordinates (3-5, 6-8)
		for (var t = 3; t < 6; t++) {
			for (var u = 6; u < 9; u++) {
				if ((t != row) && (u != col)) { //not the same coordinates as the cell we're checking
					if (curBoard[t][u] == number) { //number is not a valid option
						return false;
					}
				}
			}
		}

		return true; //number was not found in the same block, it is a valid option
	}
	else if (row < 9 && col < 3) { //block 7
		//check all blocks with coordinates (6-8, 0-2)
		for (var t = 6; t < 9; t++) {
			for (var u = 0; u < 3; u++) {
				if ((t != row) && (u != col)) { //not the same coordinates as the cell we're checking
					if (curBoard[t][u] == number) { //number is not a valid option
						return false;
					}
				}
			}
		}

		return true; //number was not found in the same block, it is a valid option
	}
	else if (row < 9 && col < 6) { //block 8
		//check all blocks with coordinates (6-8, 3-5)
		for (var t = 6; t < 9; t++) {
			for (var u = 3; u < 6; u++) {
				if ((t != row) && (u != col)) { //not the same coordinates as the cell we're checking
					if (curBoard[t][u] == number) { //number is not a valid option
						return false;
					}
				}
			}
		}

		return true; //number was not found in the same block, it is a valid option
	}
	else if (row < 9 && col < 9) { //block 9
		//check all blocks with coordinates (6-8, 6-8)
		for (var t = 6; t < 9; t++) {
			for (var u = 6; u < 9; u++) {
				if ((t != row) && (u != col)) { //not the same coordinates as the cell we're checking
					if (curBoard[t][u] == number) { //number is not a valid option
						return false;
					}
				}
			}
		}

		return true; //number was not found in the same block, it is a valid option
	}
}

function reset() { //resets the inputs fields to empty
	for (var curR = 0; curR < 9; curR++) {
		for (var curC = 0; curC < 9; curC++) {
			document.getElementsByName((curR + 1) + "" + (curC + 1))[0].value = "";
		}
	}
}