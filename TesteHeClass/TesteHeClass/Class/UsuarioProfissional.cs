namespace TesteHeClass.Class
{
    class UsuarioProfissional : Pessoa
    {
        public int CRM { get; set; }



        public UsuarioProfissional()
        {
            CRM = 0;
        }

        public UsuarioProfissional(int crm)
        {
            CRM = crm;
        }
    }
}