export default function showError(message) {
    // Seleciona o alerta e injeta a mensagem
    const alertDiv = document.getElementById('error-alert');
    alertDiv.classList.remove('d-none');  // Remove a classe 'd-none' para exibir o alerta
    alertDiv.textContent = message;       // Define a mensagem de erro no alerta

    // Opcional: esconder o alerta após alguns segundos
    setTimeout(() => {
        alertDiv.classList.add('d-none');  // Esconde o alerta novamente após 5 segundos
    }, 5000);
}