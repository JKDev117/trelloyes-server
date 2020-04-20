//17.10 (p. 21)

const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { cards, lists } = require('../store')

const listRouter = express.Router()
const bodyParser = express.json()

listRouter
  .route('/list')
  .get((req, res) => {
    res.json(lists);
  })
  .post(bodyParser, (req, res) => {
    const { header, cardIds = [] } = req.body;

    if (!header) {
      logger.error(`Header is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
  
    // check card IDs
    if (cardIds.length > 0) {
      let valid = true;
      cardIds.forEach(cid => {
        const card = cards.find(c => c.id == cid);
        if (!card) {
          logger.error(`Card with id ${cid} not found in cards array.`);
          valid = false;
        }
      });
  
      if (!valid) {
        return res
          .status(400)
          .send('Invalid data');
      }
    }
  
    // get an id
    const id = uuid();
  
    const list = {
      id,
      header,
      cardIds
    };
  
    lists.push(list);
  
    logger.info(`List with id ${id} created`);
  
    res
      .status(201)
      .location(`http://localhost:8000/list/${id}`)
      .json({id});
  })

listRouter
  .route('/list/:id')
  .get((req, res) => {
    const { id } = req.params;
    const list = lists.find(li => li.id == id);
  
    // make sure we found a list
    if (!list) {
      logger.error(`List with id ${id} not found.`);
      return res
        .status(404)
        .send('List Not Found');
    }
  
    res.json(list);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const listIndex = lists.findIndex(li => li.id == id);
  
    if (listIndex === -1) {
      logger.error(`List with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    lists.splice(listIndex, 1);
  
    logger.info(`List with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

module.exports = listRouter;


/*
POST /list
Postman: Body (tab) -> options: Raw, JSON

    (e.g.)
    {
        "header": "Header"
    }
    
    or

    {
        "header": "Header",
        "cardIds": []
    }

    or

    {
        "header": "Header",
        "cardIds": [1]
    }
    //Note: card id must exist in cards to be able to add the card to a list

*/


/*

One important note, if you're using npm run dev and make a change to your code, the server will 
restart and we'll lose any POSTed cards! This is because we store cards in memory, the JavaScript 
array, so the cards are not persisted. We'll address this problem on the checkpoint for 
databases with Express. (17.10, p. 9)

*/
