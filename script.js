const formCadastro = document.getElementById("formCadastro");

const idLivro = document.getElementById("idLivro");
const tituloLivro = document.getElementById("tituloLivro");
const autorLivro = document.getElementById("autorLivro");
const dataLivro = document.getElementById("dataLivro");

const listaLivros = document.getElementById("listaLivros");

const totalLivros = document.getElementById("totalLivros");
const livrosDisponiveis = document.getElementById("livrosDisponiveis");
const livrosEmprestados = document.getElementById("livrosEmprestados");
const livrosAtrasados = document.getElementById("livrosAtrasados");

const modalEditar = document.getElementById("modalEditar");

const editarTitulo = document.getElementById("editarTitulo");
const editarAutor = document.getElementById("editarAutor");
const editarData = document.getElementById("editarData");

const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

let livroEditando = null;

let library = [];

function salvarBiblioteca(){
  localStorage.setItem(
    "library",
    JSON.stringify(library)
  );
}

function carregarBiblioteca(){
   let dados = localStorage.getItem("library");

   if(dados){

    library = JSON.parse(dados);


   }
}

formCadastro.addEventListener("submit", function (event) {

  event.preventDefault();

  registerBook(
    idLivro.value,
    tituloLivro.value,
    autorLivro.value,
    dataLivro.value,
    false
  );

  formCadastro.reset();

  atualizarTela();

});

function atualizarTela(){

  mostrarLivros();

  atualizarDashboard();

}

function mostrarLivros() {

  listaLivros.innerHTML = "";

  library.forEach(book => {

    let card = document.createElement("div");
    card.classList.add("livro");

    card.innerHTML = `
      <h3>${book.title}</h3>

      <p><strong>ID:</strong> ${book.id}</p>

      <p><strong>Autor:</strong> ${book.autor}</p>

      <p><strong>Cadastro:</strong> ${book.createDate}</p>

      <p>
        <strong>Status:</strong>
        ${book.foiEmprestado ? "🔴 Emprestado" : "🟢 Disponível"}
      </p>
    `;


    // BOTÃO EMPRESTAR / DEVOLVER

    let btnEmprestar = document.createElement("button");


    if(book.foiEmprestado){

      btnEmprestar.textContent = "Devolver";

      btnEmprestar.addEventListener("click", function(){

        returnBook(book.id);

        atualizarTela();

      });


    } else {


      btnEmprestar.textContent = "Emprestar";

      btnEmprestar.addEventListener("click", function(){

        lendBook(book.id);

        atualizarTela();

      });

    }



    // BOTÃO EDITAR

    let btnEditar = document.createElement("button");

    btnEditar.textContent = "Editar";


    btnEditar.addEventListener("click", function(){

      abrirModalEdicao(book);

    });



    // BOTÃO REMOVER

    let btnRemover = document.createElement("button");

    btnRemover.textContent = "Remover";


    btnRemover.addEventListener("click", function(){

      if(confirm(`Deseja remover "${book.title}"?`)){

        removeBook(book.id);

        atualizarTela();

      }

    });



    // ÁREA DOS BOTÕES

    let botoes = document.createElement("div");

    botoes.classList.add("botoes-card");


    botoes.appendChild(btnEmprestar);

    botoes.appendChild(btnEditar);

    botoes.appendChild(btnRemover);



    card.appendChild(botoes);


    listaLivros.appendChild(card);


  });

}

function abrirModalEdicao(book){

    livroEditando = book;

    editarTitulo.value = book.title;

    editarAutor.value = book.autor;

    editarData.value = book.createDate;


    modalEditar.style.display = "flex";

}


btnSalvar.addEventListener("click", function(){

    if(!livroEditando){
        return;
    }

    updateBookData(
        livroEditando.id,
        {
            title: editarTitulo.value,
            autor: editarAutor.value,
            createDate: editarData.value
        }
    );


    modalEditar.style.display = "none";

    livroEditando = null;

    atualizarTela();

});


btnCancelar.addEventListener("click", function(){

    modalEditar.style.display = "none";

});



function registerBook(id, title, autor, createDate, foiEmprestado) {

  let book = {
    id,
    title,
    autor,
    createDate,
    foiEmprestado,
    dataEmprestimo: null,
    dataDevolucaoPrevista: null
  };

  library.push(book);

  salvarBiblioteca();
  return book;
}
function atualizarDashboard(){
  totalLivros.textContent = library.length;

  livrosDisponiveis.textContent = availableQuantity();

  livrosEmprestados.textContent = amountBorrowed();

  livrosAtrasados.textContent = listarLivrosAtrasados().length;

}
function listBooks() {
  console.log("Sua lista de livros é: ", library);
}

function searchForId(id) {
  let buscar = library.find((item) => {
    return item.id === id;
  });
  return buscar;
}

function searchForTitle(title) {
  let buscar = library.find((item) => {
    return item.title === title;
  });

  return buscar;
}

function searchForAutor(autor) {
  let buscar = library.filter((item) => {
    return item.autor === autor;
  });

  return buscar;
}

function updateBookData(id, newData) {
  let book = library.find((item) => item.id === id);

  if (!book) {
    alert("Seu livro não foi encontrado!");
    return;
  }

  if (newData.title !== undefined) {
    book.title = newData.title;
  }

  if (newData.autor !== undefined) {
    book.autor = newData.autor;
  }

  if (newData.createDate !== undefined) {
    book.createDate = newData.createDate;
  }

  if (newData.foiEmprestado !== undefined) {
    book.foiEmprestado = newData.foiEmprestado;
  }

   salvarBiblioteca();
}

function removeBook(id) {
  let index = library.findIndex((item) => item.id === id);
  if (index === -1) {
    alert("Seu livro não foi encontrado!");
    return;
  }
  library.splice(index, 1);

  salvarBiblioteca();
}

function lendBook(id, dias = 7) {
  let book = library.find((item) => item.id === id);

  if (!book) {
    alert("Seu livro não foi encontrado!");
    return;
  }

  if (book.foiEmprestado) {
    alert("Esse livro já está emprestado!");
    return;
  } 
 
 let hoje = new Date();

 let devolucao= new Date();
 devolucao.setDate(hoje.getDate() + dias);

  book.foiEmprestado = true;
  book.dataEmprestimo = formatarData(hoje);
  book.dataDevolucaoPrevista = formatarData(devolucao);

  salvarBiblioteca();

  alert("Livro emprestado com sucesso!");


}

function returnBook(id) {
  let book = library.find((item) => item.id === id);

  if (!book) {
    alert("Seu livro não foi encontrado!");
    return;
  }

  if (!book.foiEmprestado) {
    alert("Esse livro não está emprestado!");
    return;
  }

  book.foiEmprestado = false;
  book.dataEmprestimo = null;
  book.dataDevolucaoPrevista = null;

  salvarBiblioteca();

  alert("livro devolvido com sucesso!");
}

function listAvailableBook() {
  let disponivel = library.filter((item) => item.foiEmprestado === false);
  alert("Livros disponíveis: ", disponivel);
  return disponivel;
}

function listBorrowedBooks() {
  let emprestado = library.filter((item) => item.foiEmprestado === true);
 alert("Livros emprestados: ", emprestado);
  return emprestado;
}

function availableQuantity() {
  return library.filter(book => !book.foiEmprestado).length;
}
function amountBorrowed() {
  return library.filter(book => book.foiEmprestado).length;
}

function converterData(dataTexto) {
  let partes = dataTexto.split("/");

  let dia = partes[0];
  let mes = partes[1];
  let ano = partes[2];

  let data = new Date(ano, mes - 1, dia);
  return data;
}

function livroMaisAntigo() {
  if(library.length === 0) return null;

  let maisAntigo = library[0];
  for (let i = 1; i < library.length; i++) {
    let dataAtual = converterData(library[i].createDate);
    let dataMaisAntigo = converterData(maisAntigo.createDate);

    if (dataAtual < dataMaisAntigo) {
      maisAntigo = library[i];
    }
  }

  return maisAntigo.title;
}

function livroMaisRecente() {
  if(library.length === 0) return null;
  let maisRecente = library[0];
  for (let i = 1; i < library.length; i++) {
    let dataAtual = converterData(library[i].createDate);
    let dataMaisRecente = converterData(maisRecente.createDate);

    if (dataAtual > dataMaisRecente) {
      maisRecente = library[i];
    }
  }

  return maisRecente.title;
}
function listTitleBooks() {
  let titulos = library.map((item) => item.title);
  return titulos;
}
//funcoes extras:

function formatarData(data) {
  let dia = String(data.getDate()).padStart(2, "0");
  let mes = String(data.getMonth() + 1).padStart(2, "0");
  let ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function listarLivrosAtrasados() {
  let hoje = new Date();

  let atrasados = library.filter( book => {
    if(!book.foiEmprestado) return false;

    if(!book.dataDevolucaoPrevista) return false;

    let dataPrevista = converterData(book.dataDevolucaoPrevista);

    return dataPrevista < hoje;
  });

  
  return atrasados;
  
}

carregarBiblioteca();

atualizarTela();