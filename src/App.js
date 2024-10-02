
import { db } from './firebaseConnection.js';
import './app.css';

import { useState } from 'react';

import { doc, setDoc, collection, addDoc, getDoc, getDocs } from 'firebase/firestore';
// getDoc é pra gente buscar um item
// getDocs para buscar mais de um item

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const [posts, setPosts] = useState([]);


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

  


  return (
    <div>
      <h1>ReactJS + firebase :)</h1>

      <div className='container'>
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
        <button onClick={buscarPost}>Buscar post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <span>Título: {post.titulo}</span>
                <span>Autor: {post.autor}</span>
              </li>
            )
          })}
        </ul>

      </div>
      
    </div>
  );
}

export default App;
