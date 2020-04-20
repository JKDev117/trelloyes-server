//17.10 (p. 20)

//array to store cards
const cards = [{
    id: 1,
    title: 'Task One',
    content: 'This is card one'
}];


//array to store lists
const lists = [{
    id: 1,
    header: 'List One',
    cardIds: [1]
  }];

module.exports = { cards, lists };
