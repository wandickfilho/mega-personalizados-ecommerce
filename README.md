Loja de Personalizados — E-commerce

E-commerce de produtos personalizados, desenvolvido para apresentar produtos, permitir que os clientes explorem opções de personalização e realizem suas compras diretamente pela plataforma.

A loja oferece uma experiência de navegação intuitiva, com catálogo de produtos, páginas individuais e uma identidade visual voltada ao universo de presentes e itens personalizados.

Como executar

npm install
npm run dev
# Acesse: http://localhost:3005

Scripts disponíveis: "dev", "build", "start", "lint".

Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- "lucide-react" para ícones

Estrutura

- "src/app" — rotas e páginas da aplicação
- "src/components/layout" — Header, MobileMenu, Footer e componentes de navegação
- "src/components/home" — seções e destaques da página inicial
- "src/components/products" — cards, grade, filtros, galeria e opções de personalização
- "src/components/ui" — componentes reutilizáveis (botões, campos, modais, etc.)
- "src/config/site.ts" — configurações centrais da loja
- "src/data/products.ts" — dados dos produtos
- "src/lib" — tipos, funções auxiliares e utilitários

Funcionalidades

- Catálogo de produtos personalizados.
- Visualização individual dos produtos.
- Apresentação de imagens, descrições e preços.
- Opções de personalização dos produtos.
- Organização por categorias.
- Interface responsiva para dispositivos móveis e desktops.
- Navegação intuitiva e experiência de compra simplificada.

Pendências de cadastro e configuração

- Identidade da loja: configurar nome, descrição e informações institucionais em "src/config/site.ts".
- Produtos: cadastrar os produtos reais em "src/data/products.ts".
- Preços: definir os valores e possíveis variações de preço conforme as opções de personalização.
- Imagens: adicionar fotografias dos produtos em "public/imagens/produtos/".
- Redes sociais: configurar Instagram e demais canais de atendimento.
- Contato: cadastrar WhatsApp, e-mail, endereço e horário de funcionamento.
- Pagamento e pedidos: configurar os serviços necessários para processamento de pagamentos e gerenciamento de pedidos, caso ainda não estejam implementados.

Identidade visual

A identidade visual deve transmitir criatividade, exclusividade e confiança, valorizando o conceito de produtos feitos especialmente para cada cliente.

A interface prioriza uma apresentação visual organizada, com destaque para as fotografias dos produtos, suas opções de personalização e informações de compra.

---

Desenvolvido com Next.js, React e TypeScript.