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

const campoPesquisa = document.getElementById("campoPesquisa");
const btnPesquisar = document.getElementById("btnPesquisar");
const mensagemPesquisa = document.getElementById("mensagemPesquisa");

let livroEditando = null;

let biblioteca = [];

function salvarBiblioteca() {
  localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
}

function carregarBiblioteca() {
  let dados = localStorage.getItem("biblioteca");

  if (dados) {
    biblioteca = JSON.parse(dados);
  }
}

formCadastro.addEventListener("submit", function (event) {

  event.preventDefault();

  cadastrarLivro(
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

  mostrarLivros(biblioteca);

  atualizarDashboard();

}

btnPesquisar.addEventListener("click", function() {

  let textoPesquisado = campoPesquisa.value;
    if(textoPesquisado === ""){

      mostrarLivros(biblioteca)
      return;
    }

  let resultadoPesquisa = buscarLivros(textoPesquisado);

    if(resultadoPesquisa.length === 0){

      mensagemPesquisa.textContent = "Nenhum livro encontrado.";

    } else{

      mensagemPesquisa.textContent = "";

    }

  mostrarLivros(resultadoPesquisa);
});


function mostrarLivros(lista) {

  listaLivros.innerHTML = "";

  lista.forEach(livro => {

    let cartao = document.createElement("div");
    cartao.classList.add("livro");

    cartao.innerHTML = `
      <h3>${livro.titulo}</h3>

      <p><strong>ID:</strong> ${livro.id}</p>

      <p><strong>Autor:</strong> ${livro.autor}</p>

      <p><strong>Cadastro:</strong> ${livro.dataCadastro}</p>

      <p>
        <strong>Status:</strong>
        ${livro.foiEmprestado ? "🔴 Emprestado" : "🟢 Disponível"}
      </p>
    `;


    // BOTÃO EMPRESTAR / DEVOLVER

    let btnEmprestar = document.createElement("button");


    if(livro.foiEmprestado){

      btnEmprestar.textContent = "Devolver";

      btnEmprestar.addEventListener("click", function(){

        devolverLivro(livro.id);

        atualizarTela();

      });


    } else {


      btnEmprestar.textContent = "Emprestar";

      btnEmprestar.addEventListener("click", function(){

        emprestarLivro(livro.id);

        atualizarTela();

      });

    }



    // BOTÃO EDITAR

    let btnEditar = document.createElement("button");

    btnEditar.textContent = "Editar";


    btnEditar.addEventListener("click", function(){

      abrirModalEdicao(livro);

    });



    // BOTÃO REMOVER

    let btnRemover = document.createElement("button");

    btnRemover.textContent = "Remover";


    btnRemover.addEventListener("click", function(){

      if(confirm(`Deseja remover "${livro.titulo}"?`)){

        removerLivro(livro.id);

        atualizarTela();

      }

    });



    // ÁREA DOS BOTÕES

    let botoes = document.createElement("div");

    botoes.classList.add("botoes-cartao");


    botoes.appendChild(btnEmprestar);

    botoes.appendChild(btnEditar);

    botoes.appendChild(btnRemover);



    cartao.appendChild(botoes);


    listaLivros.appendChild(cartao);


  });

}

function abrirModalEdicao(livro){

    livroEditando = livro;

    editarTitulo.value = livro.titulo;

    editarAutor.value = livro.autor;

    editarData.value = livro.dataCadastro;


    modalEditar.style.display = "flex";

}


btnSalvar.addEventListener("click", function(){

    if(!livroEditando){
        return;
    }

    atualizarDadosLivro(
        livroEditando.id,
        {
            titulo: editarTitulo.value,
            autor: editarAutor.value,
            dataCadastro: editarData.value
        }
    );


    modalEditar.style.display = "none";

    livroEditando = null;

    atualizarTela();

});


btnCancelar.addEventListener("click", function(){

    modalEditar.style.display = "none";

});



function cadastrarLivro(id, titulo, autor, dataCadastro, foiEmprestado) {

  let livro = {
    id,
    titulo,
    autor,
    dataCadastro,
    foiEmprestado,
    dataEmprestimo: null,
    dataDevolucaoPrevista: null
  };

  biblioteca.push(livro);

  salvarBiblioteca();

  return livro;
}
function atualizarDashboard(){
  totalLivros.textContent = biblioteca.length;

  livrosDisponiveis.textContent = quantidadeDisponiveis();

  livrosEmprestados.textContent = quantidadeEmprestados();

  livrosAtrasados.textContent = listarLivrosAtrasados().length;

}
function listarLivros() {
  console.log("Sua lista de livros é: ", biblioteca);
}

function buscarPorId(id) {
  let livroEncontrado = biblioteca.find((item) => {
    return item.id === id;
  });
  return livroEncontrado;
}

function buscarPorTitulo(titulo) {
  let livroEncontrado = biblioteca.filter((item) => {
    return item.titulo.toLowerCase().includes(titulo.toLowerCase());
  });

  return livroEncontrado;
}

function buscarLivros(texto){

  let livroPorId = buscarPorId(texto);

  if(livroPorId){

    return [livroPorId];

  }
  let livrosPorTitulo = buscarPorTitulo(texto);

  if(livrosPorTitulo){

    return livrosPorTitulo;

  }

  return [];

}

function buscarPorAutor(autor) {
  let livroEncontrado = biblioteca.filter((item) => {
    return item.autor === autor;
  });

  return livroEncontrado;
}

function atualizarDadosLivro(id, novosDados) {
  let livro = biblioteca.find((item) => item.id === id);

  if (!livro) {
    alert("Seu livro não foi encontrado!");
    return;
  }

  if (novosDados.titulo !== undefined) {
    livro.titulo = novosDados.titulo;
  }

  if (novosDados.autor !== undefined) {
    livro.autor = novosDados.autor;
  }

  if (novosDados.dataCadastro !== undefined) {
    livro.dataCadastro = novosDados.dataCadastro;
  }

  if (novosDados.foiEmprestado !== undefined) {
    livro.foiEmprestado = novosDados.foiEmprestado;
  }

    salvarBiblioteca();
}

function removerLivro(id) {
  let indice = biblioteca.findIndex((item) => item.id === id);
  if (indice === -1) {
    alert("Seu livro não foi encontrado!");
    return;
  }
  biblioteca.splice(indice, 1);
}

function emprestarLivro(id, dias = 7) {
  let livro = biblioteca.find((item) => item.id === id);

  if (!livro) {
    alert("Seu livro não foi encontrado!");
    return;
  }

  if (livro.foiEmprestado) {
    alert("Esse livro já está emprestado!");
    return;
  } 
 
 let dataHoje = new Date();

 let dataDevolucao = new Date();
 dataDevolucao.setDate(dataHoje.getDate() + dias);

  livro.foiEmprestado = true;
  livro.dataEmprestimo = formatarData(dataHoje);
  livro.dataDevolucaoPrevista = formatarData(dataDevolucao);

  salvarBiblioteca();

  alert("Livro emprestado com sucesso!");
}

function devolverLivro(id) {
  let livro = biblioteca.find((item) => item.id === id);

  if (!livro) {
    alert("Seu livro não foi encontrado!");
    return;
  }

  if (!livro.foiEmprestado) {
    alert("Esse livro não está emprestado!");
    return;
  }

  livro.foiEmprestado = false;
  livro.dataEmprestimo = null;
  livro.dataDevolucaoPrevista = null;

  salvarBiblioteca();

  alert("livro devolvido com sucesso!");
}

function listarLivrosDisponiveis() {
  let livrosDisponiveisLista = biblioteca.filter((item) => item.foiEmprestado === false);
  alert("Livros disponíveis: ", disponivel);
  return livrosDisponiveisLista;
}

function listarLivrosEmprestados() {
  let livrosEmprestadosLista = biblioteca.filter((item) => item.foiEmprestado === true);
 alert("Livros emprestados: ", emprestado);
  return livrosEmprestadosLista;
}

function quantidadeDisponiveis() {
  return biblioteca.filter(livro => !livro.foiEmprestado).length;
}
function quantidadeEmprestados() {
  return biblioteca.filter(livro => livro.foiEmprestado).length;
}

function converterData(dataTexto) {
  let partesData = dataTexto.split("/");

  let dia = partesData[0];
  let mes = partesData[1];
  let ano = partesData[2];

  let data = new Date(ano, mes - 1, dia);
  return data;
}

function livroMaisAntigo() {
  if(biblioteca.length === 0) return null;

  let maisAntigo = biblioteca[0];
  for (let i = 1; i < biblioteca.length; i++) {
    let dataAtual = converterData(biblioteca[i].dataCadastro);
    let dataMaisAntigo = converterData(maisAntigo.dataCadastro);

    if (dataAtual < dataMaisAntigo) {
      maisAntigo = biblioteca[i];
    }
  }

  return maisAntigo.titulo;
}

function livroMaisRecente() {
  if(biblioteca.length === 0) return null;
  let maisRecente = biblioteca[0];
  for (let i = 1; i < biblioteca.length; i++) {
    let dataAtual = converterData(biblioteca[i].dataCadastro);
    let dataMaisRecente = converterData(maisRecente.dataCadastro);

    if (dataAtual > dataMaisRecente) {
      maisRecente = biblioteca[i];
    }
  }

  return maisRecente.titulo;
}
function listarTitulosLivros() {
  let titulos = biblioteca.map((item) => item.titulo);
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
  let dataHoje = new Date();

  let atrasados = biblioteca.filter( livro => {
    if(!livro.foiEmprestado) return false;

    if(!livro.dataDevolucaoPrevista) return false;

    let dataPrevista = converterData(livro.dataDevolucaoPrevista);

    return dataPrevista < dataHoje;
  });

  
  return atrasados;
  
}

carregarBiblioteca();
atualizarTela();