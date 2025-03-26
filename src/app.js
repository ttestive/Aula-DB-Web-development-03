// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAmnMjGxhaQHGzZAG33EXJ2SnYtrsgKQIY",
    authDomain: "web-ucb-project.firebaseapp.com",
    projectId: "web-ucb-project",
    storageBucket: "web-ucb-project.appspot.com",
    messagingSenderId: "498538189619",
    appId: "1:498538189619:web:ae9ca2f6f9a8ab46aaa446"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function buscarDados() {
    console.log('Função buscarDados foi chamada');
    
    const collectionName = document.getElementById('collection').value;
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    if (!collectionName) {
        alert('Por favor, insira o nome da coleção');
        return;
    }

    try {
        loadingDiv.style.display = 'block';
        resultsDiv.innerHTML = '';
        
        const querySnapshot = await db.collection(collectionName).get();
        
        if (querySnapshot.empty) {
            resultsDiv.innerHTML = '<p>Nenhum documento encontrado.</p>';
            return;
        }

        exibirDadosTabela(querySnapshot);
        
        if (collectionName === 'obras') {
            calcularCustoPorMetro(querySnapshot);
        }

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        resultsDiv.innerHTML = `<p style="color: red;">Erro ao buscar dados: ${error.message}</p>`;
    } finally {
        loadingDiv.style.display = 'none';
    }
}

function exibirDadosTabela(querySnapshot) {
    const resultsDiv = document.getElementById('results');
    let tableHTML = '<table border="1">';
    
    const firstDoc = querySnapshot.docs[0].data();
    
    tableHTML += '<tr><th>ID</th>';
    Object.keys(firstDoc).forEach(key => {
        tableHTML += `<th>${key}</th>`;
    });
    tableHTML += '</tr>';

    // Linhas da tabela
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
}

function calcularCustoPorMetro(querySnapshot) {
    const resultsDiv = document.getElementById('results');
    let totalCusto = 0;
    let totalArea = 0;
    let count = 0;

    querySnapshot.forEach(doc => {
        const data = doc.data();
        
        if (data.area_total && data.custo_material && data.custo_mao_obra) {
            const areaTotal = parseFloat(data.area_total);
            const custoMaterial = parseFloat(data.custo_material);
            const custoMaoObra = parseFloat(data.custo_mao_obra);

            const custoPorMetro = (custoMaterial + custoMaoObra) / areaTotal;
            totalCusto += custoMaterial + custoMaoObra;
            totalArea += areaTotal;
            count++;

            console.log(`Custo por m² (${doc.id}): R$ ${custoPorMetro.toFixed(2)}`);
        }
    });

    if (count > 0) {
        const custoTotalPorMetro = totalCusto / totalArea;
        const infoDiv = document.createElement('div');
        infoDiv.className = 'cost-info';
        infoDiv.innerHTML = `
            <h3>Resumo Financeiro</h3>
            <p>Custo médio por m²: R$ ${custoTotalPorMetro.toFixed(2)}</p>
            <p>Total de obras analisadas: ${count}</p>
            <p>Área total: ${totalArea.toFixed(2)} m²</p>
            <p>Custo total: R$ ${totalCusto.toFixed(2)}</p>
        `;
        resultsDiv.appendChild(infoDiv);
    } else {
        console.warn('Nenhum documento com campos válidos para cálculo');
    }
}

async function adicionarDados(event) {
    event.preventDefault(); 
    
    const areaTotal = parseFloat(document.getElementById('area_total').value);
    const custoMaterial = parseFloat(document.getElementById('custo_material').value);
    const custoMaoObra = parseFloat(document.getElementById('custo_mao_obra').value);

    if (isNaN(areaTotal) || isNaN(custoMaterial) || isNaN(custoMaoObra) || 
        areaTotal <= 0 || custoMaterial < 0 || custoMaoObra < 0) {
        alert('Por favor, preencha todos os campos com valores válidos.');
        return;
    }

    try {
        await db.collection('obras').add({
            area_total: areaTotal,
            custo_material: custoMaterial,
            custo_mao_obra: custoMaoObra,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert('Obra cadastrada com sucesso!');
        console.log('Dados adicionados com sucesso!');
        
        // Limpa o formulário
        document.getElementById('formCadastroObra').reset();
        
        buscarDados();
    } catch (error) {
        console.error('Erro ao adicionar dados:', error);
        alert('Erro ao cadastrar obra: ' + error.message);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada');
    
    const formCadastro = document.getElementById('formCadastroObra');
    if (formCadastro) {
        formCadastro.addEventListener('submit', adicionarDados);
    } else {
        console.error('Formulário de cadastro não encontrado');
    }
    
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', buscarDados);
    } else {
        console.error('Botão de busca não encontrado');
    }
    
    const collectionInput = document.getElementById('collection');
    if (collectionInput) {
        collectionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarDados();
            }
        });
    }
});

// Teste de conexão com Firebase
console.log('Testando conexão com Firebase...');
db.collection('obra').limit(1).get()
    .then(() => console.log('Conexão com Firestore estabelecida com sucesso!'))
    .catch(error => console.error('Erro na conexão com Firestore:', error));