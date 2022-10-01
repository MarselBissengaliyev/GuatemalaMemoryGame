document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const cardsWrapper = document.getElementById('cards');
    const roundCounter = document.getElementById('roundCounter')
    const restartBtn = document.getElementById('restart');
    const formBtn = document.getElementById('formBtn');
    const name = document.getElementById('name');
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    const rating = document.getElementById('rating');
    const wellcomeMessage = document.getElementById('wellcomeMessage');
    let formClickable = true;

    users.forEach(u => {
        rating.innerHTML += `
            <li class="list-group-item">${u.name}: ${u.result}</li>
        `;
    })

    formBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (formBtn.classList.contains('disabled')) {
            return true;
        }
        localStorage.setItem('users', JSON.stringify([...users, {
            id: users.length,
            name: name.value,
            result: roundCounter.textContent
        }]));

        rating.innerHTML += `
            <li class="list-group-item">${name.value}: ${roundCounter.textContent}</li>
        `;

        formBtn.classList.add('disabled');
        formClickable = false;
    })

    name.addEventListener('input', (e) => {
        if (+roundCounter.textContent >= 1 && name.value.length > 0 && formClickable) {
            formBtn.classList.remove('disabled');
        } else {
            formBtn.classList.add('disabled');
        }
    })

    restartBtn.addEventListener('click', restartGame)


    function createCardList() {
        const CARDS_COUNT = 10;

        for (let i = 1; i < CARDS_COUNT; i++) {
            cardsWrapper.append(createCardItem(i), createCardItem(i));
        }

        const cardItems = document.querySelectorAll('.cards__item');
        let firstIndex = null;
        let lastIndex = null;
        let unclickable = false;
        let guessed = 0;
        cardItems.forEach((item, index) => item.addEventListener('click', () => {
            if (unclickable) {
                cardItems.forEach(c => c.classList.add('unclickable'));
            } else if (!unclickable) {
                cardItems.forEach(c => {
                    if (!c.classList.contains('success')) {
                        c.classList.remove('unclickable')
                    }
                });
            }

            item.firstElementChild.classList.add('flip');
            item.lastElementChild.classList.add('hidden');

            if (firstIndex === null) {
                firstIndex = index;
            } else if (index !== firstIndex) {
                lastIndex = index;
            }

            if (firstIndex !== null && lastIndex !== null && firstIndex !== lastIndex) {
                roundCounter.textContent = +roundCounter.textContent + 1;
                if (
                    cardItems[firstIndex].firstElementChild.src ===
                    cardItems[lastIndex].firstElementChild.src
                ) {
                    unclickable = true;
                    guessed++;
                    if (guessed === 9) {
                        alert('Вы Выиграли!! УРА')
                    }
                    cardItems[firstIndex].classList.add('success', 'unclickable');
                    cardItems[lastIndex].classList.add('success', 'unclickable');
                    console.log(+roundCounter.textContent)
                    if (+roundCounter.textContent >= 1 && name.value.length > 0) {
                        formBtn.classList.remove('disabled');
                    } else {
                        formBtn.classList.add('disabled');
                    }

                    firstIndex = null;
                    lastIndex = null;
                    unclickable = false;
                } else {
                    cardItems.forEach(c => c.classList.add('unclickable'));
                    setTimeout(() => {
                        cardItems[firstIndex].firstElementChild.classList.remove('flip');
                        cardItems[firstIndex].lastElementChild.classList.remove('hidden');
                        cardItems[lastIndex].firstElementChild.classList.remove('flip');
                        cardItems[lastIndex].lastElementChild.classList.remove('hidden');

                        cardItems.forEach(c => {
                            if (!c.classList.contains('success')) {
                                c.classList.remove('unclickable')
                            }
                        });
                        firstIndex = null;
                        lastIndex = null; 
                    }, 1000) 
                }
            }
        }))
    }

    function createCardItem(i) {
        const cardItem = document.createElement('div');
        cardItem.innerHTML = `
            <img src="img/memo-0${i}.jpg"/>
            <div>?</div>    
        `;
        cardItem.classList.add('cards__item');
        cardItem.style.order = Math.round(Math.random() * 10);

        return cardItem;
    }

    function restartGame() {
        cardsWrapper.innerHTML = ``;
        roundCounter.textContent = '0';
        wellcomeMessage.classList.add('show');
        wellcomeMessage.setAttribute('aria-modal', true);
        wellcomeMessage.setAttribute('aria-hidden', false);
        // wellcomeMessage.style.display = 'block';
        createCardList();
    }

    createCardList()
})