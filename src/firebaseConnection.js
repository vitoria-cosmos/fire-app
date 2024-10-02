
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// aqui é pra gente ter a conexão com o banco

const firebaseConfig = {
    apiKey: "AIzaSyCdTihb32-TaK3GCKle2JIED8_sTPXUao8",
    authDomain: "curso-a35f6.firebaseapp.com",
    projectId: "curso-a35f6",
    storageBucket: "curso-a35f6.appspot.com",
    messagingSenderId: "619346607014",
    appId: "1:619346607014:web:a0e54d535358bbdbefed67",
    measurementId: "G-6VP5XDJS2N"
};
// aqui a gente está pegando a configuração do banco de dados

const firebaseApp = initializeApp(firebaseConfig);
// inicializa o nosso banco de dados

const db = getFirestore(firebaseApp);
// inicaliza o banco realmente

export { db };
// export sempre vai vim dentro de chaves.
// quando a gente for importar, temos que abrir chaves também