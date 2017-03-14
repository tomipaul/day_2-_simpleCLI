const readline = require('readline');
const request = require('request');
const chalk = require('chalk');

const Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'SCLIA> '
});

Interface.on('line', (input) => {
  switch(input.trim()) {
    case 'getAccess': 
      consumer.getAccess();
      break;
    case 'getBoards':
      consumer.getBoards();
      break;
    case 'getBoard':
      consumer.getBoard();
      break;
    case 'createBoard':
      consumer.createBoard();
      break;
    case 'getList':
      consumer.getList();
      break;
    case 'addList':
      consumer.addList();
      break;
    case 'getCard':
      consumer.getCard();
      break;
    case 'addCard':
      consumer.addCard();
      break;
    case 'selectList':
      consumer.selectList();
      break;
    case 'selectBoard':
      consumer.selectBoard();
      break;
    case 'getSelectedBoard':
      consumer.getSelectedBoard();
      break;
    case 'getBoardLists':
      consumer.getBoardLists();
      break;
    case 'getBoardCards':
      consumer.getBoardCards();
      break;
    case 'close':
      consumer.close();
      break;
    default:
      console.log(chalk.red("Invalid command!"));
      Interface.prompt();
  }
});

class TrelloApiConsumer {

  constructor(apiKey) {
    this.key = apiKey;
  }

  welcomeClient() {
    console.log("Welcome to the simple Trello CLIA! Enter `getAccess` on the CLI to begin");
  }

  getAccess() {
    let link = `https://trello.com/1/authorize?key=${this.key}&name=SimpleCIA&expiration=1day&response_type=token&scope=read,write,account`
    console.log(`Visit this link to obtain a token: ${link}`);
    Interface.question("Enter your token:", (token) => {
      let uri = `https://api.trello.com/1/members/me/?fields=username,fullName,url&key=${this.key}&token=${token}`;
      request(uri, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log(chalk.green('------------------------Valid Token! Account Accessed--------------------------'));
          let data = JSON.parse(body);
          for (let prop in data) {
            console.log(chalk.green(`${prop}:\t\t${data[prop]}`));
          }
          this.token = token;
          Interface.prompt();
        }
        else {
          console.log(chalk.red('------------------------Token Invalid! Account Access Denied--------------------------'))
          Interface.prompt();
        }
      });
    });
  }

  selectList() {
    Interface.question("Enter a list id: ", (listId) => {
      this.listId = listId;
      Interface.prompt();
    });
  }

  selectBoard() {
    Interface.question("Enter a board id: ", (boardId) => {
      this.boardId = boardId;
      Interface.prompt();
    });
  }

  getSelectedBoard() {
    if (typeof this.boardId === 'undefined') {
      console.log(chalk.red("No board selected, Please select a board"));
      Interface.prompt();
    }
    else {
      let uri = `https://api.trello.com/1/boards/${this.boardId}?lists=all&list_fields=name&key=${this.key}&token=${this.token}`;
      request(uri, (error, response, body) => {
        if(!error && response.statusCode==200) {
          let boardInfo = JSON.parse(body);
          for (let info in boardInfo) {
            if (typeof boardInfo[info] === 'object') {
              console.log(`${info}:\t${JSON.stringify(boardInfo[info])}`);
            }
            else {
              console.log(`${info}:\t${boardInfo[info]}`);
            }
          }
          Interface.prompt();
        }
        else {
          console.log(chalk.red(body));
          Interface.prompt();
        }
      });
    }
  }

  getBoardLists() {
    if (typeof this.boardId == 'undefined') {
      console.log(chalk.red("No board selected, Please select a board with the selectBoard command"));
      Interface.prompt();
    }
    else {
      let uri = `https://api.trello.com/1/boards/${this.boardId}/lists?cards=open&card_fields=name&fields=name&key=${this.key}&token=${this.token}`
      request(uri, (error, response, body) => {
        if(!error && response.statusCode==200) {
          for (let list of JSON.parse(body)) {
            console.log(`${JSON.stringify(list)}\n`);
          }
          Interface.prompt();
        }
        else {
          console.log(chalk.red(body));
          Interface.prompt();
        }
      });
    }
  }

  getBoardCards() {
    if (typeof this.boardId=='undefined') {
      console.log(chalk.red("No board selected, Please select a board with the selectBoard command"));
      Interface.prompt();
    }
    else {
      let uri = `https://api.trello.com/1/boards/${this.boardId}/cards?fields=name,idList,url&key=${this.key}&token=${this.token}`;
      request(uri, (error, response, body) => {
        if(!error && response.statusCode==200) {
          for (let list of JSON.parse(body)) {
            console.log(`${JSON.stringify(list)}\n`);
          }
          Interface.prompt();
        }
        else {
          console.log(chalk.red(body));
          Interface.prompt();
        }
      });
    }
  }

  getBoards() {
    let uri = `https://api.trello.com/1/members/me/boards?fields=name&key=${this.key}&token=${this.token}`;
    request(uri, (error, response, body) => {
      if(!error && response.statusCode === 200) {
        for (let board of JSON.parse(body)) {
          console.log(`name: ${board.name}`);
          console.log(`id: ${board.id}`);
          console.log('\n');
        }
        Interface.prompt();
      }
      else {
        console.log(chalk.red(body));
        Interface.prompt();
      }
    });
  }

  getBoard() {
    Interface.question('Enter Board id: ', (boardId) => {
      let uri = `https://api.trello.com/1/boards/${boardId}?lists=all&list_fields=name&key=${this.key}&token=${this.token}`;
      request(uri, (error, response, body) => {
        if(!error && response.statusCode===200) {
          let boardInfo = JSON.parse(body);
          for (let info in boardInfo) {
            if (typeof boardInfo[info] === 'object') {
              console.log(`${info}:\t${JSON.stringify(boardInfo[info])}`);
            }
            else {
              console.log(`${info}:\t${boardInfo[info]}`);
            }
          }
          Interface.prompt();
        }
        else {
          console.log(chalk.red(body));
          Interface.prompt();
        }
      });
    });
  }

  createBoard() {
    Interface.question("Enter Board name: ", (boardName) => {
      let uri = `https://api.trello.com/1/boards?name=${boardName}&key=${this.key}&token=${this.token}`;
      request({url: uri, method: "POST"}, (error, response, body) => {
        if(!error && response.statusCode===200) {
          console.log(body);
          console.log(`\nBoard '${boardName}' created succesfully!`);
          Interface.prompt();
        }
        else {
          console.log(chalk.red(body));
          Interface.prompt();
        }
      });
    });
  }

  getList() {
    Interface.question("Enter List id: ", (listId) => {
      let uri = `https://api.trello.com/1/lists/${listId}?fields=name&cards=open&card_fields=name&key=${this.key}&token=${this.token}`;
      request(uri, (error, response, body) => {
        if(!error && response.statusCode===200) {
          console.log(body);
          Interface.prompt();
        }
        else {
          console.log(chalk.red(body));
          Interface.prompt();
        }
      });
    });
  }

  addList() {
    Interface.question("Enter List Name: ", (listName) => {
      let uri = `https://api.trello.com/1/lists?name=${listName}&idBoard=${this.boardId}&key=${this.key}&token=${this.token}`;
      request({url:uri, method:'POST'}, (error, response, body) => {
        if(!error && response.statusCode===200) {
          console.log(body);
          console.log(`\nList ${listName} created succesfully!`);
          Interface.prompt();
        }
        else {
          console.log(chalk.red(body));
          Interface.prompt();
        }
      });
    });
  }

  getCard() {
    Interface.question("Enter Card id: ", (cardId) => {
      let uri = `https://api.trello.com/1/cards/${cardId}?fields=name,idList&member_fields=fullName&key=${this.key}&token=${this.token}`;
      request(uri, (error, response, body) => {
        if(!error && response.statusCode===200) {
          console.log(body);
          Interface.prompt();
        }
        else {
          console.log(chalk.red(body));
          Interface.prompt();
        }
      });
    });
  }

  addCard() {
    Interface.question("Enter Card name: ", (cardName) => {
      let uri = `https://api.trello.com/1/cards?name=${cardName}&idList=${this.listId}&key=${this.key}&token=${this.token}`;
      request({url: uri, method: "POST"}, (error, response, body) => {
        if(!error && response.statusCode === 200) {
          console.log(body);
          console.log(`\nCard ${cardName} created succesfully!`);
          Interface.prompt();
        }
        else {
          console.log(chalk.red(body));
          Interface.prompt();
        }
      });
    });
  }

  close() {
    delete this;
    console.log(chalk.blue('Bye'));
    Interface.close();
    process.exit(0);
  }
}

let consumer = new TrelloApiConsumer('c8ace7931717ae2fb456773699e88205');
consumer.welcomeClient();
Interface.prompt();