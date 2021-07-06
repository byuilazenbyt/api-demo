"use strict";

const appId = "60e46d6fd42e73809ca6c6a6";
const baseUrl = "https://dummyapi.io/data/api/";
const headers = {
    "app-id": appId
};
const sara = "60d0fe4f5311236168a109ca"

const makeCard = user => {
    let card = document.createElement('div');
    card.classList.add('card', 'mb-4');

    let header = document.createElement('div');
    header.classList.add('card-header');

    let title = document.createElement('h2');
    title.classList.add('card-title');
    title.innerText = `${user.firstName} ${user.lastName}`;

    let body = document.createElement('div');
    body.classList.add('card-body');

    let email = document.createElement('p');
    email.classList.add('card-text');
    email.innerText = `Email: ${user.email}`;

    let picture = document.createElement('img');
    picture.classList.add('image-fluid', 'image-thumbnail', 'rounded');
    picture.src = user.picture;
    picture.alt = `${user.firstName} ${user.lastName}`;

    header.appendChild(title);
    card.appendChild(header);

    body.appendChild(picture);
    body.appendChild(email);
    card.appendChild(body);

    document.getElementById('results').appendChild(card);
};

const getUsers = () => {
    return fetch(`${baseUrl}user`, {headers: headers})
        .then(response => response.body)
        .then(body => {
            const reader = body.getReader();
            return new ReadableStream({
                start(controller) {
                    return pump();

                    function pump() {
                        return reader.read().then(({done, value}) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            return pump();
                        });
                    }
                }
            })
        })
        .then(stream => {
            return new Response(stream, {headers: {"content-type": "application/json"}}).json();
        })
        .catch(err => console.error(err));
}
let users = getUsers();
users.then(result => {
    for (let user of result.data) {
        makeCard(user);
    }
});
