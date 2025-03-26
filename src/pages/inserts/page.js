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

console.log("Iniciando Firebase...");

// Teste de conexão com Firestore
db.collection("databse_parking").get()
    .then(() => console.log("✅ Conexão com Firestore bem-sucedida!"))
    .catch(error => console.error("❌ Erro na conexão com Firestore:", error));

// Obtém uma referência ao Firestore
const db = firebase.firestore();formNovoUsuario.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const car_type = document.getElementById('car_type').value;
    const client = document.getElementById('client').value;
    const color = document.getElementById('color').value;
    const cpf = document.getElementById('cpf').value;

    try {
        // Cria os timestamps
        const startTime = firebase.firestore.Timestamp.now();
        const endTime = firebase.firestore.Timestamp.fromDate(new Date(startTime.toDate().getTime() + 3600000)); // Adiciona 1 hora

        // Adiciona um novo documento na coleção "usuarios" (sem definir um ID manualmente)
        const docRef = await db.collection('usuarios').add({
            car_type: car_type,
            client: client,
            color: color,
            cpf: cpf,
            start_time: startTime,
            end_time: endTime,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Agora atualiza o documento com o próprio ID gerado automaticamente
        await db.collection('usuarios').doc(docRef.id).update({ id: docRef.id });

        alert(`Usuário cadastrado com sucesso! ID: ${docRef.id}`);

        // Limpa os campos do formulário
        formNovoUsuario.reset();
    } catch (error) {
        console.error("Erro ao adicionar usuário:", error);
        alert("Erro ao cadastrar usuário. Tente novamente.");
    }
});
