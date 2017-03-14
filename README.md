
####Notes on the simple command line application

TrelloAPIConsumer is a CLI app that consumes Trello's rest api
Valid Commands are:

getAccess: the getAccess command returns a link, you should copy the link and paste it in your browser.
The link will redirect to an authorization page to authorize the app.

getBoard: the getBoard command prompts user for a board id; the id of the board you want to get.
it returns the board data.

getBoards: the getBoards command returns all the board associated with a particular user.
The context is determined by the token

getList: the getList command prompts user for a list id; the id of the list you want to get.
it returns the list data.

getCard: the getCard command prompts user for a card id; the id of the card you want to get.
it returns the card data

selectBoard: the selectBoard command prompts user for a board id; the id of the board you want to select.
it takes the board id and adds it to the TrelloApiConsumer class as a property. Subsequently you can call
getSelectedBoard, getBoardLists and getBoardCards.

getSelectedBoard: this command will only run if a board has been selected using the selectBoard command.
it returns the selected board's data.
If not, it will return a failure message that indicates that there's no selected board.

getBoardLists: this command will only run if a board has been selected using the selectBoard command.
it returns the selected board's lists.
If not, it will return a failure message that indicates that there's no selected board.

getBoardCards: this command will only run if a board has been selected using the selectBoard command.
it returns the selected board's cards.
If not, it will return a failure message that indicates that there's no selected board.

selectList: the selectList command prompts user for a list id; the id of the list you want to select.
it takes the list id and adds it to the TrelloApiConsumer class as a property. Subsequently, you can call addCard

createBoard: this command prompts user for a string which serves as the board name and creates a new board
addList: this command will only run if a board is selected; see selectBoard
addCard: this command will only run if a list is selected; see selectList

############################################################################
A typical flow will be:
** Enter getAccess and input token to authorize- see getAccess
** Enter getBoards to see all your boards; each board has a name and id. You can note the id of any board.
** If you just like to view a board's data; enter getBoard and input the board's id.
** If you want to view the board's cards and lists; select board-- see selectBoard
	and enter getBoardLists/getBoardCards-- see getBoardLists and getBoardCards
** You can get a desired list's id from any of the two last operations(getBoard,getBoardLists) and using the getList command,
	input the list id to get list data
** You can get a desired card's id from any of the two(getBoardLists, getBoardCards) and using the getCard command.
	input the card id to get card data
** If you want to add a new list to a board- you must have selected the board-- see selectBoard
	and then using addList command, respond to prompt with desired name
**If you want to add a new card to a list- you must have selected the list-- see selectList
	and then using addCard command, respond to prompt with desired name