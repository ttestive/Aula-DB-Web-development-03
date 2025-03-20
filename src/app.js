

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAmnMjGxhaQHGzZAG33EXJ2SnYtrsgKQIY",
    authDomain: "web-ucb-project.firebaseapp.com",
    projectId: "web-ucb-project",
    storageBucket: "web-ucb-project.firebasestorage.app",
    messagingSenderId: "498538189619",
    appId: "1:498538189619:web:ae9ca2f6f9a8ab46aaa446"
};
// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Obtém uma referência ao Firestore
const db = firebase.firestore();

// Função para buscar dados
async function buscarDados() {
    console.log('Função buscarDados foi chamada'); // Log para debug

    const collectionName = document.getElementById('collection').value;
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    console.log('Nome da coleção:', collectionName); // Log para debug

    if (!collectionName) {
        alert('Por favor, insira o nome da coleção');
        return;
    }

    try {
        loadingDiv.style.display = 'block';
        console.log('Iniciando busca na coleção:', collectionName); // Log para debug
        
        // Busca os documentos
        const querySnapshot = await db.collection(collectionName).get();
        console.log('Documentos encontrados:', querySnapshot.size); // Log para debug
        
        if (querySnapshot.empty) {
            resultsDiv.innerHTML = '<p>Nenhum documento encontrado.</p>';
            return;
        }

        // Cria a tabela com os resultados
        let tableHTML = '<table border="1">';
        
        // Adiciona cabeçalho com todas as propriedades do primeiro documento
        const firstDoc = querySnapshot.docs[0].data();
        tableHTML += '<tr><th>ID</th>';
        Object.keys(firstDoc).forEach(key => {
            tableHTML += `<th>${key}</th>`;
        });
        tableHTML += '</tr>';

        // Adiciona os dados
        querySnapshot.forEach(doc => {
            const data = doc.data();
            tableHTML += `<tr><td>${doc.id}</td>`;
            Object.keys(firstDoc).forEach(key => {
                tableHTML += `<td>${data[key]}</td>`;
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</table>';
        resultsDiv.innerHTML = tableHTML;

    } catch (error) {
        console.error("Erro ao buscar dados:", error); // Log para debug
        resultsDiv.innerHTML = `<p style="color: red;">Erro ao buscar dados: ${error.message}</p>`;
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// Adiciona evento quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada'); // Log para debug
    
    const searchButton = document.getElementById('searchButton');
    const collectionInput = document.getElementById('collection');

    if (searchButton) {
        console.log('Botão de busca encontrado'); // Log para debug
        searchButton.addEventListener('click', () => {
            console.log('Botão clicado'); // Log para debug
            buscarDados();
        });
    } else {
        console.error('Botão de busca não encontrado');
    }

    if (collectionInput) {
        collectionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter pressionado'); // Log para debug
                buscarDados();
            }
        });
    }
});

// Teste inicial de conexão
console.log('Testando conexão com Firebase...');
db.collection('test').get()
    .then(() => console.log('Conexão com Firestore estabelecida com sucesso!'))
    .catch(error => console.error('Erro na conexão com Firestore:', error));