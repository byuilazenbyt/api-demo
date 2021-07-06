"use strict";

const appId = "60e46d6fd42e73809ca6c6a6";
const baseUrl = "https://dummyapi.io/data/api/";
const headers = {
    "app-id": appId
};
const sara = "60d0fe4f5311236168a109ca"


const helloWorld = () => {
    return fetch(`${baseUrl}user/${sara}`, {
        headers: headers
    });
}

helloWorld()
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
        return new Response(stream, {headers: {"content-type": "application/json"}}).json()
    })
    .then(result => {
        // elements
        let name = document.getElementById('name');
        let photo = document.getElementById('picture');
        let gender = document.getElementById('gender');
        let location = document.getElementById('location');
        let phone = document.getElementById('phone');
        let dateOfBirth = document.getElementById('date-of-birth');
        let email = document.getElementById('email')

        if (result.hasOwnProperty('firstName') && result.hasOwnProperty('lastName')) {
            name.innerText = `${result.firstName} ${result.lastName}`;
        } else {
            throw new Error('Could not create full name');
        }

        if (result.hasOwnProperty('gender')) {
            gender.innerText = result.gender
        } else {
            throw new Error('Could not determine gender');
        }

        if (result.hasOwnProperty('location')) {
            if (result.location.hasOwnProperty('street') && result.location.hasOwnProperty('city') && result.location.hasOwnProperty('state') && result.location.hasOwnProperty('country')) {
                location.innerText = `${result.location.street}, ${result.location.city}, ${result.location.state}, ${result.location.country}`;
            }  else {
                throw new Error('Location format invalid.');
            }
        } else {
            throw new Error('Could not determine location.');
        }

        if (result.hasOwnProperty('phone')) {
            phone.innerText = result.phone;
        }  else {
            throw new Error('Could not determine phone');
        }

        if (result.hasOwnProperty('picture')) {
            let image = document.createElement('img');
            image.src = result.picture;
            image.classList.add('img-fluid');
            image.classList.add('img-thumbnail');
            image.classList.add('rounded');
            image.alt = `${result.firstName} ${result.lastName}`;
            photo.appendChild(image);
        }  else {
            throw new Error('Could not fetch picture');
        }

        if (result.hasOwnProperty('dateOfBirth')) {
            dateOfBirth.innerText = result.dateOfBirth;
        }   else {
            throw new Error('Could not determine date of birth');
        }

        if (result.hasOwnProperty('email')) {
            email.innerText = result.email;
        }   else {
            throw new Error('Could not determine email address');
        }
    });
