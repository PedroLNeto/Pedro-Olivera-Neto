using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TesteHeClass.Class
{
    public class Pessoa
    {
        public string Nome {get; set;}
        public string User { get; set; }
        public string Senha { get; set; }
        public string Nasc { get; set; }
        public string Endereco { get; set; }
        public string Email { get; set; }
        public string CPF { get; set; }

        public Pessoa()
        {
            Nome = null;
            User = null;
            Senha = null;
            Nasc = null;
            Endereco = null;
            Email = null;
            CPF = null;
        }

        public Pessoa (string nome, string user, string senha, string nasc, string endereco, string email, string cpf)
        {
            Nome = nome;
            User = user;
            Senha = senha;
            Nasc = nasc;
            Endereco = endereco;
            Email = email;
            CPF = cpf;

        }

        

    }
}
