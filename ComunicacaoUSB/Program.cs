using System;
using System.IO.Ports;
using System.Net.Http;
using System.Text;
using System.Text.Json;

class Program
{
    static SerialPort porta = null!;
    static readonly HttpClient cliente = new HttpClient();

    static void Main()
    {
        porta = new SerialPort("COM16", 115200);

        // Como o STM32 envia \r\n
        porta.NewLine = "\n";
        porta.ReadTimeout = 1000;

        porta.DataReceived += DadosRecebidos;

        try
        {
            porta.Open();

            Console.WriteLine("COM16 conectada!");
            Console.WriteLine("Aguardando dados do STM32...");

            Console.ReadLine();
        }
        catch (Exception erro)
        {
            Console.WriteLine("Erro ao abrir a COM16:");
            Console.WriteLine(erro.Message);
        }
    }

    static async void DadosRecebidos(object sender, SerialDataReceivedEventArgs e)
    {
        try
        {
            string dados = porta.ReadLine().Trim();

            Console.WriteLine();
            Console.WriteLine("Recebido do STM32:");
            Console.WriteLine(dados);

            // Converte o JSON recebido para um objeto
            DadosSTM32? leitura =
                JsonSerializer.Deserialize<DadosSTM32>(dados);

            if (leitura == null)
            {
                Console.WriteLine("Dados inválidos.");
                return;
            }

            // Converte ADC (0-4095) para porcentagem (0-100)
            double satisfacao =
                (leitura.adc * 100.0) / 4095.0;

            Console.WriteLine("ADC: " + leitura.adc);
            Console.WriteLine("Tensão: " + leitura.tensao + " V");
            Console.WriteLine("Satisfação: " +
                              satisfacao.ToString("F1") + "%");
            Console.WriteLine("Filtro: " +
                              (leitura.filtro == 1 ? "Ativado" : "Desativado"));

            // Envia a medição para o servidor
            await EnviarParaServidor(satisfacao);
        }
        catch (Exception erro)
        {
            Console.WriteLine("Erro ao processar dados:");
            Console.WriteLine(erro.Message);
        }
    }

    static async Task EnviarParaServidor(double satisfacao)
    {
        try
        {
            var dados = new
            {
                satisfacao = Math.Round(satisfacao, 1)
            };

            string json =
                JsonSerializer.Serialize(dados);

            var conteudo = new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );

            HttpResponseMessage resposta =
                await cliente.PostAsync(
                    "http://localhost:3000/medicoes",
                    conteudo
                );

            string retorno =
                await resposta.Content.ReadAsStringAsync();

            Console.WriteLine("Enviado para o servidor:");
            Console.WriteLine(json);

            Console.WriteLine("Resposta do servidor:");
            Console.WriteLine(retorno);
        }
        catch (Exception erro)
        {
            Console.WriteLine("Erro ao enviar para o servidor:");
            Console.WriteLine(erro.Message);
        }
    }

    class DadosSTM32
    {
        public int adc { get; set; }
        public double tensao { get; set; }
        public double porcentagem { get; set; }
        public int filtro { get; set; }
    }
}