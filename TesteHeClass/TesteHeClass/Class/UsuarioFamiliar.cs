namespace TesteHeClass.Class
{
    class UsuarioFamiliar:Pessoa
    {
                private string Parentesco { get; set; }

        public UsuarioFamiliar()
        {
            Parentesco = null;
        }

        public UsuarioFamiliar(string parentesco)
        {
            Parentesco = parentesco;
        }
    }
}
