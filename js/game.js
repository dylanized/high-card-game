class DeckClass {
  constructor() {
    this.cards = [
      // diamonds
      { value: 2, suit: 'd' },
      { value: 3, suit: 'd' },
      { value: 4, suit: 'd' },
      { value: 5, suit: 'd' },
      { value: 6, suit: 'd' },
      { value: 7, suit: 'd' },
      { value: 8, suit: 'd' },
      { value: 9, suit: 'd' },
      { value: 10, suit: 'd' },
      { value: 11, suit: 'd' },
      { value: 12, suit: 'd' },
      { value: 13, suit: 'd' },
      { value: 14, suit: 'd' },
      // hearts
      { value: 2, suit: 'h' },
      { value: 3, suit: 'h' },
      { value: 4, suit: 'h' },
      { value: 5, suit: 'h' },
      { value: 6, suit: 'h' },
      { value: 7, suit: 'h' },
      { value: 8, suit: 'h' },
      { value: 9, suit: 'h' },
      { value: 10, suit: 'h' },
      { value: 11, suit: 'h' },
      { value: 12, suit: 'h' },
      { value: 13, suit: 'h' },
      { value: 14, suit: 'h' },
      // clubs
      { value: 2, suit: 'c' },
      { value: 3, suit: 'c' },
      { value: 4, suit: 'c' },
      { value: 5, suit: 'c' },
      { value: 6, suit: 'c' },
      { value: 7, suit: 'c' },
      { value: 8, suit: 'c' },
      { value: 9, suit: 'c' },
      { value: 10, suit: 'c' },
      { value: 11, suit: 'c' },
      { value: 12, suit: 'c' },
      { value: 13, suit: 'c' },
      { value: 14, suit: 'c' },
      // spades
      { value: 2, suit: 's' },
      { value: 3, suit: 's' },
      { value: 4, suit: 's' },
      { value: 5, suit: 's' },
      { value: 6, suit: 's' },
      { value: 7, suit: 's' },
      { value: 8, suit: 's' },
      { value: 9, suit: 's' },
      { value: 10, suit: 's' },
      { value: 11, suit: 's' },
      { value: 12, suit: 's' },
      { value: 13, suit: 's' },
      { value: 14, suit: 's' },
    ];
    this.values = {
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      "10": "10",
      "11": "Jack",
      "12": "Queen",
      "13": "King",
      "14": "Ace",
    };
    this.suits = {
      'd': "&diams;",
      'h': "&hearts;",
      'c': "&clubs;",
      's': "&spades;",
    };
  }
  shuffle() {
    // define shuffle helper
    function shuffleArray(array) {
      // from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    // shuffle cards
    shuffleArray(this.cards);
  }
  deal() {
    // if there's cards left, grab the top card and return it, else return false
    return this.hasCards() ? this.cards.pop() : false;
  }
  hasCards() {
    return this.cards.length > 0 ? true : false;
  }
}

// instantiate deck
const deck = new DeckClass();

// define header component
Vue.component('game-header', {
  props: {
    'user-wins': {
      type: Number,
    },
    'dealer-wins': {
      type: Number,
    },
    'num-cards': {
      type: Number,
    },
  },
  template: `
    <header>
      <span :style="this.userWins > this.dealerWins ? 'color:gold; font-weight:bold;' : ''">You {{ userWins }}</span>
      <span>{{ numCards }} cards remaining</span>
      <span :style="this.dealerWins > this.userWins ? 'color:gold; font-weight:bold;' : ''">Dealer {{ dealerWins }}</span>
    </header>
  `,
});

// define game hand component
Vue.component('game-hand', {
  props: {
    'button': {
      type: String,
      default: 'Pick a card',
    }
  },
  data: function () {
    return {
      userCard: null,
      dealerCard: null,
      result: null,
    };
  },
  template: `
    <div>
      <section v-if="this.userCard">
        <p>You picked <span class="card" :class="userCard.suit" v-html="displayCard(userCard)"></span></p>
        <p>Dealer picked <span class="card" :class="dealerCard.suit" v-html="displayCard(dealerCard)"></span></p>
        <p style="margin: 2rem">
          <span v-if="this.result === 1" style="color:gold; font-weight:bold;">You win!</span>
          <span v-else-if="this.result === 2" v-html="">Dealer wins!</span>
          <span v-else-if="this.result === 0">It's a tie!</span>
        </p>
        <button v-if="deck.hasCards()" v-on:click="startHand">Pick another card</button>
        <div v-else>
          <p><small><em>No cards left!</p>
          <p><small><em><a href="index.html">Shuffle the deck and play again</a></em></small></p>
      </section>
      <button v-else v-on:click="startHand">Pick a card</button>
    </div>
  `,
  methods: {
    startHand() {
      // reset the hand
      this.result = null;
      // deal cards
      this.userCard = deck.deal();
      this.dealerCard = deck.deal();
      // update number of cards
      this.$root.getNumCards();
      // determine winner
      if (this.userCard.value > this.dealerCard.value) {
        this.result = 1;
        this.$root.userWins++;
      }
      else if (this.userCard.value < this.dealerCard.value) {
        this.result = 2;
        this.$root.dealerWins++;
      }
      else this.result = 0;
    },
    displayCard(card) {
      return `${ deck.values[card.value] } of <span>${ deck.suits[card.suit] }</span>`;
    },
  },
});

// define app component
new Vue({
  el: '#app',
  data() {
    return {
      userWins: 0,
      dealerWins: 0,
      numCards: deck.cards.length,
    };
  },
  methods: {
    getNumCards() {
      this.numCards = deck.cards.length;
    },
  },
  created() {
    // when app starts, shuffle the deck
    deck.shuffle();
  },
});
