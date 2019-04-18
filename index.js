const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let loadButtonEl;
let albumsDivEl;

function createPhotosList(photos) {
  const ulEl = document.createElement('ul');
  ulEl.classList.add('photos');

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    ulEl.setAttribute('id', photo.albumId);

    // creating paragraph
    const aEl = document.createElement('a');
    aEl.setAttribute('href', photo.url);
    const imgEl = document.createElement('img');
    imgEl.setAttribute('src', photo.thumbnailUrl);
    aEl.appendChild(imgEl);
    // creating list item
    const liEl = document.createElement('li');
    liEl.appendChild(aEl);

    ulEl.appendChild(liEl);
  }

  return ulEl;
}

function onPhotosReceived() {
  const text = this.responseText;
  const photos = JSON.parse(text);

  const albumId = photos[0].albumId;

  const ulList = document.getElementsByClassName('photos');
  for (let i = 0; i < ulList.length; i++) {
    const photo = ulList[i];
    if (photo.getAttribute('id') !== albumId) {
      photo.remove();
    }
  }

  const divEl = document.getElementById(albumId);
  if (divEl.childNodes.length <= 1) {
    divEl.appendChild(createPhotosList(photos));
  }
}

function onLoadPhotos() {
  const el = this;
  const albumId = el.getAttribute('id');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', onPhotosReceived);
  xhr.open('GET', BASE_URL + '/photos?albumId=' + albumId);
  xhr.send();
}

function onLoadAlbums() {
  const el = this;
  const userId = el.getAttribute('data-user-id');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', onAlbumsReceived);
  xhr.open('GET', BASE_URL + '/albums?userId=' + userId);
  xhr.send();
}

function onAlbumsReceived() {
  postsDivEl.style.display = 'none';
  albumsDivEl.style.display = 'block';

  const text = this.responseText;
  const albums = JSON.parse(text);

  const divEl = document.getElementById('albums-content');
  while (divEl.firstChild) {
    divEl.removeChild(divEl.firstChild);
  }
  divEl.appendChild(createAlbumsList(albums));
}

function createAlbumsList(albums) {
  const ulEl = document.createElement('ul');

  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];

    // creating paragraph
    const strongEl = document.createElement('strong');
    strongEl.textContent = album.title;

    const pEl = document.createElement('p');
    pEl.appendChild(strongEl);

    const albumIdAttr = album.id;
    strongEl.setAttribute('id', albumIdAttr);
    strongEl.addEventListener('click', onLoadPhotos);

    // creating list item
    const liEl = document.createElement('li');
    liEl.appendChild(pEl);

    ulEl.appendChild(liEl);
  }

  return ulEl;
}

function createCommentsList(comments) {
  const ulEl = document.createElement('ul');
  ulEl.classList.add('comments');

  const h3El = document.createElement('h3');
  h3El.textContent = 'Comments';
  ulEl.appendChild(h3El);

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    ulEl.setAttribute('id', comment.postId);

    // creating paragraph
    const strongEl = document.createElement('strong');
    strongEl.textContent = comment.name;

    const pEl = document.createElement('p');
    pEl.appendChild(strongEl);
    pEl.appendChild(document.createTextNode(`: ${comment.body}`));

    const iEl = document.createElement('i');
    iEl.textContent = comment.email;

    // creating list item
    const liEl = document.createElement('li');
    liEl.appendChild(pEl);
    liEl.appendChild(iEl);
    ulEl.appendChild(liEl);
  }
  return ulEl;
}

function onCommentsReceived() {
  const text = this.responseText;
  const comments = JSON.parse(text);

  const postId = comments[0].postId;

  const ulList = document.getElementsByClassName('comments');
  for (let i = 0; i < ulList.length; i++) {
    const comment = ulList[i];
    if (comment.getAttribute('id') !== postId) {
      comment.remove();
    }
  }

  const divEl = document.getElementById(postId);
  if (divEl.childNodes.length <= 1) {
    divEl.appendChild(createCommentsList(comments));
  }
}

function onLoadComments() {
  const el = this;
  const postId = el.getAttribute('post-id');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', onCommentsReceived);
  xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
  xhr.send();
}

function createPostsList(posts) {
  const ulEl = document.createElement('ul');

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    // creating paragraph
    const strongEl = document.createElement('strong');
    strongEl.textContent = post.title;

    const pEl = document.createElement('p');
    pEl.appendChild(strongEl);
    pEl.appendChild(document.createTextNode(`: ${post.body}`));

    const postIdAttr = post.id;
    strongEl.setAttribute('post-id', postIdAttr);
    strongEl.addEventListener('click', onLoadComments);

    // creating list item
    const liEl = document.createElement('li');
    liEl.setAttribute('id', postIdAttr)
    liEl.appendChild(pEl);

    ulEl.appendChild(liEl);
  }

  return ulEl;
}

function onPostsReceived() {
  postsDivEl.style.display = 'block';
  albumsDivEl.style.display = 'none';

  const text = this.responseText;
  const posts = JSON.parse(text);

  const divEl = document.getElementById('posts-content');
  while (divEl.firstChild) {
    divEl.removeChild(divEl.firstChild);
  }
  divEl.appendChild(createPostsList(posts));
}

function onLoadPosts() {
  const el = this;
  const userId = el.getAttribute('data-user-id');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', onPostsReceived);
  xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
  xhr.send();
}

function createUsersTableHeader() {
  const idTdEl = document.createElement('td');
  idTdEl.textContent = 'Id';

  const nameTdEl = document.createElement('td');
  nameTdEl.textContent = 'Name';

  const buttonOneTdEl = document.createElement('td');
  buttonOneTdEl.textContent = 'Posts';

  const buttonTwoTdEl = document.createElement('td');
  buttonTwoTdEl.textContent = 'Albums';

  const trEl = document.createElement('tr');
  trEl.appendChild(idTdEl);
  trEl.appendChild(nameTdEl);
  trEl.appendChild(buttonOneTdEl);
  trEl.appendChild(buttonTwoTdEl);

  const theadEl = document.createElement('thead');
  theadEl.appendChild(trEl);
  return theadEl;
}

function createUsersTableBody(users) {
  const tbodyEl = document.createElement('tbody');

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // creating id cell
    const idTdEl = document.createElement('td');
    idTdEl.textContent = user.id;

    // creating name cell
    const dataUserIdAttr = document.createAttribute('data-user-id');
    dataUserIdAttr.value = user.id;
    const dataUserAlbumIdAttr = document.createAttribute('data-user-id');
    dataUserAlbumIdAttr.value = user.id;

    const usernameTdEl = document.createElement('td');
    usernameTdEl.textContent = user.name;

    const buttonEl = document.createElement('button');
    buttonEl.textContent = 'View all posts';
    buttonEl.setAttributeNode(dataUserIdAttr);
    buttonEl.addEventListener('click', onLoadPosts);

    const buttonAlbumEl = document.createElement('button');
    buttonAlbumEl.textContent = 'View all albums';
    buttonAlbumEl.setAttributeNode(dataUserAlbumIdAttr);
    buttonAlbumEl.addEventListener('click', onLoadAlbums);

    const buttonOneTdEl = document.createElement('td');
    buttonOneTdEl.appendChild(buttonEl);
    const buttonTwoTdEl = document.createElement('td');
    buttonTwoTdEl.appendChild(buttonAlbumEl);

    // creating row
    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(usernameTdEl);
    trEl.appendChild(buttonOneTdEl);
    trEl.appendChild(buttonTwoTdEl);

    tbodyEl.appendChild(trEl);
  }

  return tbodyEl;
}

function createUsersTable(users) {
  const tableEl = document.createElement('table');
  tableEl.appendChild(createUsersTableHeader());
  tableEl.appendChild(createUsersTableBody(users));
  return tableEl;
}

function onUsersReceived() {
  loadButtonEl.remove();

  const text = this.responseText;
  const users = JSON.parse(text);

  const divEl = document.getElementById('users-content');
  divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', onUsersReceived);
  xhr.open('GET', BASE_URL + '/users');
  xhr.send();
}

document.addEventListener('DOMContentLoaded', (event) => {
  usersDivEl = document.getElementById('users');
  postsDivEl = document.getElementById('posts');
  albumsDivEl = document.getElementById('albums');
  loadButtonEl = document.getElementById('load-users');
  loadButtonEl.addEventListener('click', onLoadUsers);
});
