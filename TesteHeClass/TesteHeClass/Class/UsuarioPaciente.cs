namespace TesteHeClass.Class
{
    class UsuarioPaciente : Pessoa
    {
        public int ResultadoTeste { get; set; }

        public UsuarioPaciente()
        {
            ResultadoTeste = 0;
        }

        public UsuarioPaciente(int resultadoTeste)
        {
            ResultadoTeste = resultadoTeste;
        }

    }
}
