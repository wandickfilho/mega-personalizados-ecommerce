# CellShop Max — Catálogo de Celulares

Catálogo digital de smartphones da **CellShop Max**. O site apresenta os aparelhos
disponíveis e direciona o cliente para atendimento pelo WhatsApp.

> Este projeto **não** é um e-commerce: não há carrinho, checkout, pagamento online,
> cadastro de clientes nem sistema de pedidos.

## Como executar

```bash
npm install
npm run dev
# Acesse: http://localhost:3005
```

Scripts: `dev`, `build`, `start`, `lint`.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- `lucide-react` para ícones

## Estrutura

- `src/app` — rotas: `/`, `/celulares`, `/celulares/[slug]`, `/marcas`, `/sobre`, `/contato`
- `src/components/layout` — Header, MobileMenu, Footer, BrandLogo
- `src/components/home` — seções da Home
- `src/components/phones` — card, grade, filtros, galeria, variações
- `src/components/ui` — componentes reutilizáveis (SearchBar, botões, etc.)
- `src/config/site.ts` — configuração central (nome, WhatsApp, contato)
- `src/data/phones.ts` — dados dos aparelhos (atualmente **exemplos de desenvolvimento**)
- `src/lib` — tipos e utilitários

## Pendências de cadastro

- **WhatsApp oficial**: preencher `WHATSAPP_NUMBER` em `src/config/site.ts`
  (somente dígitos, com DDI — ex.: `5583999999999`). Enquanto vazio, os botões
  ficam desativados e nenhum link fictício é gerado.
- **Instagram, endereço, horário e e-mail**: preencher em `src/config/site.ts`.
- **Produtos reais**: substituir os dados de exemplo em `src/data/phones.ts`.
- **Imagens**: adicionar em `public/imagens/produtos/`. Sem imagem, a interface
  usa uma composição neutra de fallback.
- **Foto da loja**: adicionar em `public/imagens/` e referenciar em `StoreShowcase`.

## Identidade visual

Paleta "Claro Premium": azul-marinho `#050326`, branco `#FFFFFF`, cinza-claro
`#F5F6FA`, vermelho da marca `#B62B42` e grafite `#202434`. Tipografia Inter +
Manrope.
