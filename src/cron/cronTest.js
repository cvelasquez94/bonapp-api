const { runCronJob } = require('./scheduleCron');

// Función que simula la ejecución del cron job
async function testCronJob() {
  console.log("Iniciando prueba del cron job...");
  await runCronJob(); // Asume que esta función ejecuta la lógica de tu cron job
  console.log("Prueba del cron job completada.");
}

testCronJob().catch(console.error);