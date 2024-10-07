
import { db, auth } from './firebaseConnection.js';
import './app.css';

import { useState, useEffect } from 'react';

import { 
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
// getDoc é pra gente buscar um item
// getDocs para buscar mais de um item
// updateDoc é pra atualizar os dados de um documento
// o deleteDoc é pra exluir um documento de acordo com o id
// Doc é para especificar um documento
// o onSnapshot é pra que possamos salvar e atualizar algo no banco em tempo real


// importar os metodos para criar novos usuários
import {
  createUserWithEmailAndPassword
} from 'firebase/auth';
// método para criar um usuário com email e senha

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const [posts, setPosts] = useState([]);

  // state para atualizar um post por meio do seu id
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    async function loadPosts() {
      // alert('TESTE')
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(listaPost);
      })

      // a gente esta verificando em tempo real a nossa coleção de posts e atualizando na tela
      // os resultados, automaticamente
    }

    loadPosts();
  }, [])
  // [] = é array de depenndencias
  // Este useEffect vai ser carregado quando o componente aparecer na tela


  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    // .then(() => {
    //   console.log('DADOS REGISTRADOS NO BANCO!')
    // })
    // .catch((error) => {
    //   console.log('GEROU ERRO' + error)
    // })
    // setDoc é pra criar um documento novo
    // o primeiro parametro é a conexão com o firestore e o segundo é o caminho que queremos cadastrar o item
    // depois da virgula, é o que queremos cadastrar
    // o setDoc é uma promise, por isso pode dá certo ou não
    // aqui a gente está criando um novo documento com id estático
    // o setDoc é vc que vai especificar o documento que vc quer criar, fixo


    // função de criar um novo documento com id único
    // o addDoc é como se tivessemos clicado no auto id

    await addDoc(collection(db, "posts"), {
      // o addDoc vai adicionar um novo documento com id automatico
      // addDoc também é uma promise
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log('CADASTRADO COM SUCESSO')
      // depois q cadastrar no banco, os valores dos campos sejam resetados
      setAutor('');
      setTitulo('');
    })
    .catch((error) => {
      console.log('ERRO ' + error)
    })
  }

  async function buscarPost() {
    // alert('TESTE')

    // const postRef = doc(db, "posts", "12345")

    // await getDoc(postRef)
    // .then((snapshot) => {
    //   // O snapshot é para acessar os dados

    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)

    // })
    // .catch(() => {
    //   console.log("ERRO AO BUSCAR")
    // })

    // primeiro parametro é a conexão do nosso banco, depois a collection que 
    // queremos acessar, depois, o id do doc queremos saber seus valores
    // ai depois, vamos buscar com o getDoc, com a nossa referencia dentro

    // quando clicarmos no botaço de buscar, ele tem que setar nos campos os valores 
    // que estão ligados ao id especificado na função


    // agora vamos buscar vários posts
    const postsRef = collection(db, "posts")

    // acessa a nossa query
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })
      // vamos percorrer cada documento e colocar na lista cada objeto com suas informações

      setPosts(lista);
    })
    .catch((error) => {
      console.log("DEU ALGUM ERRO AO BUSCAR: ", error)
    })

  }

  // função para atualizar post
  async function editarPost() {
    // alert('TESTE')
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log('POST ATUALIZADO!')
      // reseta os valores dos campos
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch((error) => {
      console.log('ERRO AO ATUALIZAR O POST, erro: ', error)
    })

    // primeiro vamos criar a nossa referencia
    // depois vamos acessar o nosso doc
    // depois, é o caminho, ou seja, a coleção que queremos acessar
    // depois, vamos dizer qual que é o id que queremos acessar
    // depois, vamos quais as propriedades do documento que queremos atualizar
    // o updateDoc é uma promise, então se atualizar vai ter o caso de sucesso
    // se não atualizar vai cair no erro
  }

  // função para excluir post
  async function excluirPost(id) {
    // alert('ID DO POST ' + id)
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    // na nossa docReference, a gente tem que passar o acesso ao banco de dados,
    // a coleção que queremos acessar e o documento que queremos deletar
    // como é uma promise, temos o caso de sucesso e o de erro
    .then(() => {
      alert("POST DELETADO COM SUCESSO!")
    })
    .catch((error) => {
      alert("ERRO AO DELETAR POST, erro: ", error)
    })

    // para excluir eu preciso do id do post
    // é uma função asíncrona, pois demora um pouco pra se comunicar com o banco de dados
  }


  async function novoUsuario() {
    // alert('Teste');

    await createUserWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log('CADASTRADO COM SUCESSO!')
      // mostra o que recebemos
      console.log('valores recebidos: ',value)

      // acessar o uid do user
      console.log("uid do user:", value.user.id);
      setEmail('');
      setSenha('');
    })
    .catch((error) => {
      console.log('ERRO AO CADASTRAR NOVO USUÁRIO!')
      // algumas tratativas com o email
      if (error.code === 'auth/weak-password') {
        alert('Senha muito fraca.')
      } else if (error.code === 'auth/email-already-in-use') {
        alert('Email já existe!')
      }
    })



    // primeiro tem que passar qual a conexão com o auth
    // depois o email
    // e o password
  }
  


  return (
    <div>
      <h1>ReactJS + firebase :)</h1>

      <div className='container'>
        <h2>Usuários:</h2>
        <label>Email:</label>
        <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Digite um email'
        /> <br/>

      <label>Senha:</label>
      <input
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
      placeholder='Informe sua senha'
      />
      <br/>

      <button onClick={novoUsuario}>Cadastrar</button>
      </div>

      <br/><br/>
      <hr/>

      <div className='container'>
        <h2>POSTS</h2>

        <label>ID do Post</label>
        <input
        placeholder='Digite o ID do post'
        value={idPost}
        onChange={(e) => setIdPost(e.target.value)}
        /> <br/>

        <label>Título:</label>

        <textarea
        type='text'
        placeholder='Digite o título'
        value={titulo}
        // vai ser o valor do titulo o valor

        onChange={ (e) => setTitulo(e.target.value)}
        // aqui vamos observar se o valor do campo está sendo alterado e setar seu valor na state
        />

        <label>Autor:</label>

        <input
        type='text'
        placeholder='Autor do post'
        value={autor}
        onChange={ (e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button><br/>
        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br/>
                <span>Título: {post.titulo}</span><br/>
                <span>Autor: {post.autor}</span><br/>
                <button onClick={() => excluirPost(post.id)}>Excluir</button><br/><br/>
                {/* quando o botão for clicado, vamos pegar o id do post */}
              </li>
            )
          })}
        </ul>

      </div>
      
    </div>
  );
}

export default App;
