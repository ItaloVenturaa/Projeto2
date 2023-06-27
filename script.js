// PARTE QUE FAZ O MENU EM CIMA SER FIXO
const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", window.scrollY > 80);
});

//POSTAGEM DE IMAGEM  
var posts = []; // Armazena as postagens
var errorMessageTimeout;

function uploadPhoto() {
  var fileInput = document.getElementById("fileInput");
  var titleInput = document.getElementById("title");
  var captionInput = document.getElementById("caption");

  var file = fileInput.files[0];
  var title = titleInput.value;
  var caption = captionInput.value;

  // Verificação se tudo ta certo antes de postar!
  if (!file) {
    displayErrorMessage("Nenhuma foto foi carregada!");
  } else if (!title) {
    displayErrorMessage("O título está em branco. Por favor, preencha o título.");
  } else if (!caption) {
    displayErrorMessage("A legenda está em branco. Por favor, preencha a legenda.");
  } else {
    var reader = new FileReader();
    reader.onload = function (e) {
      var post = {
        photo: e.target.result,
        title: title,
        caption: caption,
        date: new Date().toLocaleDateString() // Gera a data atual
      };
      posts.push(post);

      displayPosts(); // Atualiza a lista de postagens

      // Limpa o formulário
      fileInput.value = "";
      titleInput.value = "";
      captionInput.value = "";
    };
    reader.readAsDataURL(file);
  }
}

function displayPosts() {
  var postList = document.getElementById("postList");
  postList.innerHTML = ""; // Limpa a lista de postagens


  for (var i = 0; i < posts.length; i++) {
    var post = posts[i];

    var postContainer = document.createElement("div");
    postContainer.className = "postContainer";
    postContainer.id = "postContainer_" + i;

    var img = document.createElement("img");
    img.src = post.photo;
    img.classList.add("imgteste");

    var postContent = document.createElement("div");
    postContent.className = "postContent";
    postContent.classList.add("about-img");

    var title = document.createElement("div"); // Elemento para exibir o título
    title.className = "title";
    title.textContent = post.title;
    title.style.fontSize = "25px";

    var caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = post.caption;

    var date = document.createElement("div"); // Elemento para exibir a data
    date.className = "date";
    date.textContent = post.date;

    var actions = document.createElement("div");
    actions.className = "actions";

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.classList.add("btn");
    deleteButton.onclick = (function (index) {
      return function () {
        deletePost(index);
      };
    })(i);


    var editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("btn");
    editButton.onclick = (function (index) {
      return function () {
        editPost(index);
      };
    })(i);

    actions.appendChild(deleteButton);
    actions.appendChild(editButton);

    postContent.appendChild(title);
    postContent.appendChild(caption);
    postContent.appendChild(date);
    postContent.appendChild(actions);

    var editForm = document.createElement("form");
    editForm.className = "editForm";
    editForm.innerHTML = ' <section class="about" id="about"><input type="text" class="editTitle" id="title" placeholder="Digite um novo título"><br><input type="text" id="caption" class="editCaption" placeholder="Digite uma nova legenda"><br><br><button type="submit" class="btn">Salvar</button><button type="button" class="cancelButton btn">Cancelar</button></section>';

    postContainer.appendChild(img);
    postContainer.appendChild(postContent);
    postContainer.appendChild(editForm);

    postList.appendChild(postContainer);
  }

}


function deletePost(index) {
  posts.splice(index, 1);
  updatePostsInLocalStorage(); // Atualiza os posts no localStorage
  displayPosts(); // Atualiza a exibição dos posts na página
}

function editPost(index) {
  var postContainer = document.getElementById("postContainer_" + index);
  var postContent = postContainer.querySelector(".postContent");
  var editForm = postContainer.querySelector(".editForm");

  postContent.style.display = "none";
  editForm.style.display = "block";

  var titleInput = editForm.querySelector(".editTitle");
  var captionInput = editForm.querySelector(".editCaption");
  var cancelButton = editForm.querySelector(".cancelButton");

  titleInput.value = posts[index].title;
  captionInput.value = posts[index].caption;

  cancelButton.onclick = function () {
    postContent.style.display = "flex";
    editForm.style.display = "none";
  };

  editForm.onsubmit = function (e) {
    e.preventDefault();
    var newTitle = titleInput.value;
    var newCaption = captionInput.value;
    if (newTitle && newCaption) {
      posts[index].title = newTitle;
      posts[index].caption = newCaption;
      updatePostsInLocalStorage(); // Atualiza os posts no localStorage
      displayPosts(); // Atualiza a exibição dos posts na página
      postContent.style.display = "flex";
      editForm.style.display = "none";
    }
  };
}


// Função para exibir mensagem de erro
function displayErrorMessage(message) {
  var errorMessage = document.getElementById("errorMessage");

  errorMessage.textContent = message;
  errorMessage.classList.add("show");

  if (errorMessageTimeout) {
    clearTimeout(errorMessageTimeout);
  }

  errorMessageTimeout = setTimeout(function () {
    errorMessage.classList.remove("show");
    errorMessageTimeout = null;
  }, 4000);
}

// Função para buscar posts
function displayFilteredPosts(filteredPosts) {
  var postList = document.getElementById("postList");

  // Remove todas as postagens existentes da lista
  var existingPosts = postList.getElementsByClassName("postContainer");
  while (existingPosts[0]) {
    existingPosts[0].parentNode.removeChild(existingPosts[0]);
  }

  if (filteredPosts.length === 0) {
    displayErrorMessage("Nenhum resultado encontrado.");
    return;
  }

  for (var i = 0; i < filteredPosts.length; i++) {
    var post = filteredPosts[i];

    var postContainer = document.createElement("div");
    postContainer.className = "postContainer";
    postContainer.id = "postContainer_" + i;

    var img = document.createElement("img");
    img.src = post.photo;
    img.classList.add("imgteste");

    var postContent = document.createElement("div");
    postContent.className = "postContent";
    postContent.classList.add("about-img");

    var title = document.createElement("div"); // Elemento para exibir o título
    title.className = "title";
    title.textContent = post.title;
    title.style.fontSize = "25px";

    var caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = post.caption;

    var date = document.createElement("div"); // Elemento para exibir a data
    date.className = "date";
    date.textContent = post.date;

    var actions = document.createElement("div");
    actions.className = "actions";

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.classList.add("btn");
    deleteButton.onclick = (function (index) {
      return function () {
        deletePost(index);
      };
    })(i);

    var editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("btn");
    editButton.onclick = (function (index) {
      return function () {
        editPost(index);
      };
    })(i);

    actions.appendChild(deleteButton);
    actions.appendChild(editButton);

    postContent.appendChild(title);
    postContent.appendChild(caption);
    postContent.appendChild(date);
    postContent.appendChild(actions);

    var editForm = document.createElement("form");
    editForm.className = "editForm";
    editForm.innerHTML = '<section class="about" id="about"><input type="text" class="editTitle" id="title" placeholder="Digite um novo título"><br><input type="text" id="caption" class="editCaption" placeholder="Digite uma nova legenda"><br><br><button type="submit" class="btn">Salvar</button><button type="button" class="cancelButton btn">Cancelar</button></section>';

    postContainer.appendChild(img);
    postContainer.appendChild(postContent);
    postContainer.appendChild(editForm);

    postList.appendChild(postContainer);
  }
}

function searchPosts() {
  var searchInputValue = searchInput.value.toLowerCase();

  if (!searchInputValue) {
    displayPosts();
    return;
  }

  var filteredPosts = posts.filter(function (post) {
    var title = post.title.toLowerCase();
    var caption = post.caption.toLowerCase();
    return title.includes(searchInputValue) || caption.includes(searchInputValue);
  });

  displayFilteredPosts(filteredPosts);

  if (filteredPosts.length === 0) {
    displayErrorMessage("Nenhum resultado encontrado.");
  }
}

// Restante do código...




// Função para marcar o conteúdo encontrado
function markContent(element, searchText) {
  var content = element.innerHTML;
  var markedContent = content.replace(
    new RegExp(searchText, "g"),
    "<span style='background-color: yellow;'>" + searchText + "</span>"
  );
  element.innerHTML = markedContent;
}

// Função para remover a marcação do conteúdo
function unmarkContent(element) {
  var content = element.innerHTML;
  var unmarkedContent = content.replace(/<\/?span[^>]*>/g, ""); // Remove as tags <span>
  element.innerHTML = unmarkedContent;
}

// Exemplo de como adicionar posts ao LocalStorage
function addPostToLocalStorage(post) {
  var storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
  storedPosts.push(post);
  localStorage.setItem('posts', JSON.stringify(storedPosts));
}

// Função para atualizar os posts no localStorage
function updatePostsInLocalStorage() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Carregar os posts do localStorage ao inicializar a página
function loadPostsFromLocalStorage() {
  var storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
  posts = storedPosts;
  displayPosts();
}

// Adicionar os posts ao LocalStorage
function addPostsToLocalStorage() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Chamada para carregar os posts do localStorage ao carregar a página
loadPostsFromLocalStorage();

// Adicionar evento de escuta para o input de busca
var searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", searchPosts);

function togglePostForm() {
  var postForm = document.getElementById("postForm");
  var toggleButton = document.getElementById("togglePostFormButton");

  if (postForm.style.display === "none") {
    postForm.style.display = "block";
    toggleButton.textContent = "Fechar Postagem";
  } else {
    postForm.style.display = "none";
    toggleButton.textContent = "Fazer Postagem";
  }
}

function toggleSearch() {
  var searchInput = document.getElementById("searchInput");
  var toggleButton = document.getElementById("toggleSearchButton");

  if (searchInput.style.display === "none") {
    searchInput.style.display = "block";
    toggleButton.textContent = "Fechar Pesquisa";
  } else {
    searchInput.style.display = "none";
    toggleButton.textContent = "Pesquisar";
  }
}
