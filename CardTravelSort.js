/**
 * Сортировщик карточек путешественника
 */

/* 
 * @param {Array} data - неупорядоченный массив карточек
 *
 * Контекст определен в каждой функции - решение для проблемы с контекстом в forEach.
 */

function CardTravelSort(data) {
  var cts = this;
  cts.trip = [];
  cts.cards = [];
  cts.hashTable = {};

  if (data) {
    cts.importCard(data);
  }

  return cts;
}


/**
 * Конструктор хеш-таблицы
 * 
 * Предоставляет быстрый доступ к следующей карточке в маршруте.
 * В итоге, хеш-таблица принимает вот такой вид:
 *  {
 *    Madrid: 0,
 *    Barcelona: 1,
 *    Stockholm: 2,
 *    Gerona_Airport: 3
 *  }
 Например, имея карточку Мадрид-Барселона, следующая находится вот так:
    1) Индекс пункта назначения (Барселоны) - 1.
    2) cts.cards[индекс]
 */

CardTravelSort.prototype.buildHashTable = function() {
  var cts = this;
  cts.cards.forEach(function(card, i) {
    cts.hashTable[card.origin.name] = i;
  });
}


/**
 * Импорт карточек
 * @param {Array} data - неупорядоченный массив карточек 
 *
 * Копирует данные из data в cards (cвойство CardTravelSort).
 * Здесь же вызывается buildHashTable();
 */

CardTravelSort.prototype.importCard = function(data) {
  var cts = this;

  // Reset the cards Array
  cts.cards = [];

  if (data instanceof Array) {

    // Check if input is invalid
    data.forEach(function(card) {
      if (!card.origin.name || card.origin.name === '') {
        console.error('origin.name property is missing in ' + JSON.stringify(card));
      } else if (!card.destination.name || card.destination.name === '') {
        console.error('destination.name property is missing in ' + JSON.stringify(card));
      }
    })
    cts.cards = data;
  }

  cts.buildHashTable();
}


/**
 * Поиск начальной карточки
 *
 * Cоздает массив с всеми пунктами назначения, а затем определяет
 * пункт отправления, который не присутствует в этом массиве.
 * Временная сложность - О(2n) = O(n).
 */

CardTravelSort.prototype.findDepartureCard = function() {
  var cts = this;
  var destinations = [];

  cts.cards.forEach(function(card) {
    destinations.push(card.destination.name);
  });

  cts.cards.forEach(function(card) {
    if (destinations.indexOf(card.origin.name) === -1) {
      cts.trip.push(card);
    }
  });

}


/**
 * Сортировка карточек/построение маршрута
 *
 * Зная первую карточку и имея доступ к хеш-таблица,
 * построение маршрута становится тривиальным.
 * 
 * 1) Найти значение card.destination.name в хеш-таблице.
 * 2) В первоначальном массиве cards найти следующую карточку cards[index].
 *
 * Временная сложность - О(1) * n = O(n).
 */

CardTravelSort.prototype.sortCard = function() {
  var cts = this;
  cts.departureCard = cts.findDepartureCard();

  for (var i = 0; i < cts.cards.length - 1; i++) {
    var currentCard = cts.trip[i];
    var nextCardIndex = cts.hashTable[currentCard.destination.name];
    var nextCard = cards[nextCardIndex];
    cts.trip.push(nextCard);
  }
}


/**
 * Вывод маршрута
 *
 * Зная первую карточку и имея доступ к хеш-таблица,
 * построение маршрута становится тривиальным.
 * 
 * 1) Найти значение card.destination.name в хеш-таблице.
 * 2) В первоначальном массиве cards найти следующую карточку cards[index].
 *
 * Временная сложность - О(1) * n = O(n).
 */

CardTravelSort.prototype.printItinerary = function() {
  var cts = this;

  // Вспомогательная функция для вывода информации о месте в транспорте.
  var printSeat = function(card) {
    if (card.transport.seat) {
      return 'Seat ' + card.transport.seat + '. ';
    } else {
      return 'No seat assigned. ';
    }
  };

  // Создает элемент для вывода маршрута.
  var itinerary = document.createElement('div');

  cts.trip.forEach(function(card) {
    var cardDirections = '';

    switch (card.transport.type) {
      case 'plane':
        // Определяет, какую информацию о багаже добавить в маршрут.
        // Could be implemented in the same way as printSeat for consistency.
        var baggage = (card.transport.baggage_drop ? 'Baggage drop at ticket counter ' + card.transport.baggage_drop + '. ' : '');
        cardDirections = '<span>From ' + card.origin.name + ', take flight ' + card.transport.route + ' to ' + card.destination.name + '. Gate ' + card.transport.gate + '. ' + printSeat(card) + baggage + (card.transport.notes || '') + '</span><br>';
        break;
      case 'train':
        cardDirections = '<span>Take train ' + card.transport.route + ' from ' + card.origin.name + ' to ' + card.destination.name + '. ' + printSeat(card) + (card.transport.notes || '') + '</span><br>';
        break;
      case 'airport_bus':
        cardDirections = '<span>Take the airport bus from ' + card.origin.name + ' to ' + card.destination.name + '. ' + printSeat(card) + (card.transport.notes || '') + '</span><br>';
        break;
      case 'taxi':
        cardDirections = '<span>Take a Yandex.Taxi from ' + card.origin.name + ' to ' + card.destination.name + '. ' + (card.transport.notes || '') + '</span><br>';
        break;
      case 'walking':
        cardDirections = '<span>Walk from ' + card.origin.name + ' to ' + card.destination.name + '. ' + (card.transport.notes || '') + '</span><br>';
        break;
      default:
        cardDirections = '<span>Go from ' + card.origin.name + ' to ' + card.destination.name + '. ' + (card.transport.notes || '') + '</span><br>';
    }

    // Inserts directions into the element with id 'itinerary'.
    itinerary.innerHTML += cardDirections;
  });
  document.getElementsByTagName('body')[0].appendChild(itinerary);
}
