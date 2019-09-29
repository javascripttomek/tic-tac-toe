/**
 * utworzymy funkcje modal, ktora przyjmuje argument tekstowy, ktory ma byc pozniej wyswietlony
 * 
 * chcemy obiekt, ktorego wywolanie utworzy nam nowy element html na stronie
 * 
 * 'document' jest to obiekt dostarczany przez javascript z przestrzeni globalnej, ktory odzwierciedla document HTML
 * 
 * odzwierciedla rozne metody pozwalajace na korzystanie z DOM
 * 
 * funkcja 'createElement()' tworzy nam nowy element HTML, przyjmuje za argument string
 */
// tworzymy funkcje Modal, ktora jest konstruktorem
// argument closeCallback przekazujemy jako opcjonalny, dlatego jest na koncu w ()
function Modal(message, closeCallback) {
    this.closeCallback = closeCallback;
    // zadeklarowalismy funkcje przyjmujaca argument 'message', ktory chcemy pozniej wyswietlic
    // stworzymy nowego diva
    this.modalEl = document.createElement('div');
    // element div nie ma stylu, klasy, jest bezuzyteczny jak na razie
    // obiekt HTML ma swoje metody, jedna z nich jest className
    this.modalEl.className = 'modal';
    // mamy nowy element 'div' i podpieta do niego klase 'modal'
    // teraz chcemy do tego elementu dodac jakas zawartosc
    // silnik javascript potraktuje to jako obiekt html dzieki innerText
    this.modalEl.innerHTML = '<p>' + message + '</p>';
    // chcemy zamykac Modal, potrzebujemy do tego przycisku
    const closeButton = document.createElement('button');
    // za pomoca innerText wrzucilismy do srodka etykiete 'close'
    closeButton.innerText = 'close';
    // dodajemy przycisk
    this.modalEl.appendChild(closeButton);
    // chcemy, zeby button reagowal na zdarzenia, w tym wypadku klikniecie
    // zakres funkcji przyslania zakres zewnetrzny
    // polecenie bind.this mowi funkcji 'dzialaj w zakresie, ktory zostal podany jako argument funkcji'
    closeButton.addEventListener('click', this.close.bind(this));
    // teraz chcemy dodac element do dokumentu HMTL
    // chcemy dodac konkretnie do body, a odzwierciedleniem tego jest documentElement
    document.documentElement.appendChild(this.modalEl);
}
// uzyjemy prototypowania, aby dodac metode, ktora pozwoli na ukrycie okna
Modal.prototype.close = function () {
    // poprzez kontekst odwolujemy sie do stworzonego juz elementu z funkcji Modal
    // polecenie 'remove' usuwa element html z dokumentu
    this.modalEl.remove();
    //jezeli callback zostal zdefiniowany, zostanei wywolany
    if (this.closeCallback !== undefined) {
        this.closeCallback();
    }
};
const modal = new Modal('welcome to tic-tac-toe');

// tworzymy tabelke, ktora chcemy chowac, modyfikowac jej stan w trakcie gry
// musimy stworzyc obiekt gry
// 1 funkcja tworzaca tabele
// 2 funkcja tworzaca wiersz
// 3 funkcja tworzaca komorke
// funkcje beda wywolywane iteracyjnie
function TicTacToeGame() {
    // tworzymy wlasciwosc gameContainer
    // querySelector bedzie przeszukiwal nam html w celu znalezienia elementu o id podanym za #
    this.gameContainer = document.querySelector('#game-container');
    // musimy wprowadzic tury
    this.xUser = 'x';
    this.oUser = 'o';
    // tworzymy zmienna aktualnego uzytkownika 
    this.currentUser = this.xUser;
    // w clickHandlerze sprawdzamy aktualnego uzytkownika, x czy o

    // deklarujemy zmienna win, ktora posluzy takze do blokady gry po wygranej
    this.win = false;
}

// tworzymy nowa funkcje, ktora bedzie inicjalizowala gre
TicTacToeGame.prototype.init = function () {
    /** a to powoduje blad, choc mialo robic dobrze :)
    if(this.modal!==undefined){
        this.modal.close();
    }
    */
    const xUser = document.querySelector('#x-user').value;
    const oUser = document.querySelector('#o-user').value;
    if (xUser !== oUser && !this.win) {
        this.xUser = xUser;
        this.oUser = oUser;
        // za kazdym razem po init stworzona zostanie tabela i dodana do dokumentu
        const table = this.createTable();
        // kazemy za kazdym razem najpierw wyczyscic zawartosc, zeby nie zaladowac pod rzad miliona tabel
        this.gameContainer.innerHTML = '';
        this.gameContainer.appendChild(table);
        this.currentUser = xUser;
    } else if (this.win) {
        this.win = false;
        this.init();
    } else {
        this.modal = new Modal('type different nicknames');
    }
};

// rozszerzamy prototyp tictactoegame o nowa funkcje stworzenia tabeli
// dla prototypu tworzymy metode createX
TicTacToeGame.prototype.createTable = function () {
    // tworzymy pusty element table
    const table = document.createElement('table');
    ['1', '2', '3'].forEach(function (rowId) {
        // tworzymy nowy wiersz
        const row = this.createRow(rowId);
        table.appendChild(row);
    }.bind(this));
    return table;
};

// przekazujemy do wiersza index, bo kazda komorka na razie ma takie samo id
TicTacToeGame.prototype.createRow = function (rowId) {
    const row = document.createElement('tr');
    // nie potrzebujemy klasy, poniewaz wiersza nie bedziemy stylowac
    // bedziemy musieli odwolywac sie bezposrednio do komorek, tworzymy wiec tablice zawierajaca nazwy naszych kolumn
    ['a', 'b', 'c'].forEach(function (col) {
        // petla forEach jest wywolywana dla kazdego elementu tu tablicy
        // chcemy utworzyc nowa komorke poprzez odniesienie do obiektu
        const cell = this.createCell(col + rowId);
        row.appendChild(cell);
        // bindujemy, zeby wskazac zakres obiektu, a nie tylko petli forEach
    }.bind(this));
    // zwracamy wiersz
    return row;
};

// towrzymy nowa metode obslugujaca klikniecie - event
// obiekt eventu ma wiele wlasciwosci, miedzy innymi target, tj. co wywolalo to zdarzenie
TicTacToeGame.prototype.cellClickHandler = function (event) {
    // definiujemy, ze stala cell to target z obiektu event
    const cell = event.target;
    if (cell.innerHTML !== '' || this.win) {
        return;
    }
    if (this.currentUser === this.xUser) {
        // jesli mamy to, co wywoluje zdarzenie, mozemy umiescic jakas zawartosc
        // &times to encja do times, czyli wskazanie na times - x
        cell.innerHTML = '&times';
        cell.dataset.value = 'x';
        // po kliknieciu przelaczamy uzytkownika
        //this.currentUser = this.oUser;
        // &#9675 tez odwoluje sie do okregu
    } else {
        cell.innerHTML = '&cir;';
        cell.dataset.value = 'o';
        // przelaczamy uzytkownika
        //this.currentUser = this.xUser;
    }
    this.win = this.checkResults();
    if (this.win) {
        this.modal = new Modal(this.currentUser + ' is a winner!', this.init.bind(this));
    } else {
        this.currentUser = this.currentUser === this.xUser ? this.oUser : this.xUser;
    }
};

TicTacToeGame.prototype.createCell = function (id) {
    const cell = document.createElement('td');
    cell.className = 'cell';
    // tworzymy id, zeby sie odwolac
    cell.id = id;
    // tworzymy dataset, gdzie bedziemy przechowywali jakas informacje
    cell.dataset.value = '';
    // dodajemy tu metode klikniecia
    cell.addEventListener('click', this.cellClickHandler.bind(this));
    // na razie nie mamy wiersza, wiec musimy zwrocic komorke, zebysmy mogli ja wywolac i dodac
    return cell;
};


TicTacToeGame.prototype.results = [
    ['a1', 'b1', 'c1'],
    ['a2', 'b2', 'c2'],
    ['a3', 'b3', 'c3'],
    ['a1', 'a2', 'a3'],
    ['c1', 'c2', 'c3'],
    ['b1', 'b2', 'b3'],
    ['a1', 'b2', 'c3'],
    ['a3', 'b2', 'c1']
];

// tworzymy nowa funkcje checkResults

TicTacToeGame.prototype.checkResults = function () {
    let win = false;
    for (let idx = 0; idx < this.results.length; idx++) {
        const resRow = this.results[idx];
        // sprytny zabieg mapowania
        // tworzymy nowa zmienna result, ktora powstaje w skutek przemapowania tablic resRow
        const result = resRow.map(function (id) {
            // za pomoca id wyciagamy jego element, a takze dataset
            // dostaniemy kombinacje 3 roznych znakow, pustego stringa, x i o
            const cell = document.querySelector('#' + id);
            return cell.dataset.value;
            // wynikiem przemapowania jest tablica, a funkcja join zwraca tablice jako string
            // string zlozony z elementow tablicy rozdzielonych argumentem join() tu pusty string
        }).join('');
        if (result === 'xxx' || result === 'ooo') {
            win = true;
        }
    }
    return win;
};

//tymczasowo inicjalizujemy
const game = new TicTacToeGame();

//metoda globalna, ktora wyszukuje nasz przycisk startu za pomoca querySelector
const button = document.querySelector('#start-game');

// tu jest wazna kolejnosc. chcemy miec niepuste inputy na nickname

let xUser = document.querySelector('#x-user');
let oUser = document.querySelector('#o-user');


// sprawdzamy, czy pola input nie sa puste
function checkNames() {
    button.disabled = !(xUser.value !== '' && oUser.value !== '');
}

xUser.addEventListener('input', checkNames);
oUser.addEventListener('input', checkNames);

button.addEventListener('click', function () {
    game.init();
});
