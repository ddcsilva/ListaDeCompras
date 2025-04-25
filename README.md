# 🛒 Lista de Compras

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)
![Status](https://img.shields.io/badge/status-concluído-success)
![Deploy](https://github.com/ddcsilva/ListaDeCompras/actions/workflows/deploy.yml/badge.svg)

🔗 [Acesse a Lista de Compras Online](https://ddcsilva.github.io/ListaDeCompras/)

Uma aplicação web moderna e responsiva para gerenciar sua lista de compras do dia a dia. Desenvolvida com HTML, CSS e JavaScript puro, focando em uma experiência de usuário intuitiva e acessível.

![Preview da Aplicação](preview.png)

## 🚀 Deploy Automático

Este projeto utiliza GitHub Actions para deploy automático no GitHub Pages. Toda vez que um push é feito para a branch `main`, o site é automaticamente atualizado.

O workflow de deploy:
1. É acionado automaticamente em pushes para a branch `main`
2. Pode ser acionado manualmente através do GitHub Actions
3. Utiliza as últimas versões das actions do GitHub
4. Configura as permissões necessárias para o deploy

## ✨ Funcionalidades

### Gerenciamento de Lista
- ✅ Adicionar itens com quantidade
- ✅ Marcar itens como comprados
- ✅ Remover itens individualmente
- ✅ Limpar toda a lista
- 📊 Contador de itens e comprados

### Personalização
- 👤 Nome personalizável com modal de boas-vindas
- 🎨 Tema escuro/claro
- 💾 Salvamento automático de preferências
- ⚙️ Configurações acessíveis no topo

### Interface
- 📱 Design totalmente responsivo
- 🔝 Botão "Voltar ao topo"
- 🌟 Animações e transições suaves
- 🎯 Feedback visual em todas as ações

## 🎨 Design e UX

### Personalização de Usuário
- Modal elegante de boas-vindas na primeira visita
- Nome personalizado no título da lista
- Formatação inteligente (ex: "do João", "da Maria")
- Edição posterior através do botão de configurações
- Animações suaves nas interações

### Temas
- Alternância entre tema claro e escuro
- Transições suaves entre temas
- Persistência da preferência do usuário
- Interface adaptativa em ambos os temas

### Acessibilidade
- Navegação completa por teclado
- Suporte a leitores de tela
- Contraste adequado em ambos os temas
- Feedback visual e textual claro

## 🚀 Tecnologias Utilizadas

### Frontend
- HTML5 Semântico
- CSS3
  - Variáveis CSS
  - Flexbox
  - Grid
  - Media Queries
  - Animações e Transições
- JavaScript (ES6+)
  - LocalStorage
  - Event Listeners
  - Manipulação do DOM

### Armazenamento
- LocalStorage para dados da lista
- Persistência de preferências do usuário
- Salvamento automático de alterações

### Deploy
- GitHub Pages
- GitHub Actions para deploy automático
- Integração Contínua

## 🎯 Como Usar

1. Acesse a aplicação pela primeira vez
2. Personalize seu nome no modal de boas-vindas
3. Adicione itens à sua lista:
   - Digite o nome do item
   - Ajuste a quantidade
   - Clique em "Adicionar" ou pressione Enter
4. Gerencie seus itens:
   - Marque como comprados
   - Remova individualmente
   - Use "Limpar Tudo" para recomeçar
5. Personalize sua experiência:
   - Alterne entre temas com 🌙/☀️
   - Edite seu nome com ⚙️
   - Use o botão ↑ para voltar ao topo

## 💾 Armazenamento Local

- Lista de itens
- Nome do usuário
- Preferência de tema
- Todos os dados persistem entre sessões

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- 🖥️ Desktop
- 💻 Tablet
- 📱 Smartphone
- Orientações retrato e paisagem

## 🛠️ Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Commit suas mudanças
   ```bash
   git commit -m 'Adiciona nova feature'
   ```
4. Push para a branch
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Danilo** - [LinkedIn](https://www.linkedin.com/in/ddcsilva/)

---

Feito com ❤️ por Danilo