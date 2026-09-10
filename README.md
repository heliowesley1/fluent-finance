# Fluent Finance

Crie uma aplicação web completa de controle financeiro pessoal, com aparência de produto SaaS financeiro moderno e premium.

STACK OBRIGATÓRIA

React

Vite

TypeScript

Tailwind CSS

shadcn/ui

Lucide Icons

Arquitetura componentizada e escalável

Design totalmente responsivo para desktop, tablet e mobile

Preparar a estrutura para integração com backend/banco de dados

Código limpo, organizado e fácil de manter

🎯 OBJETIVO DA APLICAÇÃO

Quero uma plataforma para controlar toda a minha vida financeira em um único lugar.

O sistema deve permitir acompanhar:

Dinheiro disponível

Contas bancárias

Cartões de crédito

Receitas

Despesas

Transferências

Investimentos

Dívidas

Parcelamentos

Assinaturas

Metas financeiras

Orçamentos

Patrimônio

Fluxo de caixa

Contas recorrentes

Contas futuras

Relatórios

Análises financeiras

Evolução patrimonial

A experiência deve ser extremamente simples para cadastrar informações, mas poderosa para analisar os dados.

🎨 DESIGN

Priorize MUITO a aparência.

Quero um design:

Moderno

Premium

Minimalista

Elegante

Profissional

Limpo

Intuitivo

Com excelente hierarquia visual

Com microinterações

Com animações sutis

Sem excesso de informações na tela

Não quero aparência de sistema administrativo antigo.

A interface deve lembrar produtos modernos de fintech/SaaS.

Utilize:

Cards modernos

Bordas suaves

Sombras discretas

Ícones Lucide

Gráficos elegantes

Badges

Tooltips

Dropdowns

Modais bem projetados

Skeleton loading

Toast notifications

Empty states

Estados de erro bem tratados

Criar suporte para:

Light mode

Dark mode

O Dark Mode deve ser muito bem trabalhado e não simplesmente inverter as cores.

Use uma paleta sofisticada, com uma cor de destaque para ações positivas e indicadores financeiros, mas evite deixar a interface excessivamente colorida.

🧭 ESTRUTURA PRINCIPAL

Criar um layout com:

Sidebar lateral no desktop:

Dashboard

Lançamentos

Contas

Cartões

Orçamentos

Metas

Investimentos

Dívidas

Assinaturas

Relatórios

Patrimônio

Configurações

No mobile, utilizar:

Bottom navigation

Menu lateral através de drawer

Botão flutuante para adicionar lançamento

🏠 DASHBOARD

O Dashboard deve ser a principal tela da aplicação.

Criar uma visão financeira completa.

No topo:

"Bom dia, [nome] 👋"

Mostrar um resumo financeiro do período atual.

Cards:

Saldo total

Mostrar:

R$ 12.540,00

Com comparação:

+8,4% em relação ao mês anterior

Receitas

Mostrar total recebido no mês.

Despesas

Mostrar total gasto no mês.

Saldo do mês

Receitas - despesas.

Patrimônio líquido

Total de ativos - total de passivos.

GRÁFICO DE FLUXO DE CAIXA

Criar gráfico mostrando:

Receitas x Despesas

Por:

Dia

Semana

Mês

Permitir alterar o período.

DESPESAS POR CATEGORIA

Gráfico de donut/pizza mostrando:

Alimentação

Transporte

Moradia

Lazer

Saúde

Educação

Assinaturas

Compras

Outros

Ao clicar em uma categoria, mostrar detalhes.

COMPARAÇÃO MENSAL

Gráfico mostrando os últimos 6 ou 12 meses.

Exemplo:

Janeiro
Fevereiro
Março
Abril
Maio
Junho

Comparar:

Receitas
Despesas
Saldo

PRÓXIMAS CONTAS

Mostrar:

Netflix — R$ 39,90 — vence em 2 dias

Aluguel — R$ 1.200,00 — vence em 5 dias

Internet — R$ 99,90 — vence em 8 dias

Botão:

"Ver todas"

CARTÃO DE CRÉDITO

Mostrar resumo dos cartões:

Nubank
Fatura atual: R$ 1.240,80
Limite disponível: R$ 2.759,20
Vencimento: 10/09

Permitir acessar a fatura.

METAS

Mostrar progresso das metas.

Exemplo:

Reserva de emergência
R$ 3.500 / R$ 10.000
35%

Nova viagem
R$ 1.200 / R$ 5.000
24%

⚡ CADASTRO RÁPIDO

Essa é uma das partes MAIS IMPORTANTES.

O usuário deve conseguir cadastrar uma despesa em poucos segundos.

Criar botão:

"+ Adicionar"

Ao clicar, abrir um modal moderno.

Opções:

Receita

Despesa

Transferência

Para despesa:

Valor
Descrição
Categoria
Conta
Data
Forma de pagamento
Observação

Adicionar opções:

☑ É recorrente
☑ É parcelado

Se for parcelado:

Quantidade de parcelas

Exemplo:

R$ 1.200
12x

O sistema deve calcular automaticamente:

R$ 100/mês

🚀 LANÇAMENTO INTELIGENTE

Criar uma experiência de cadastro extremamente rápida.

Permitir digitar algo como:

"Almoço 35"

e sugerir:

Despesa
R$ 35,00
Categoria: Alimentação
Data: hoje

Outro exemplo:

"Salário 3500"

Interpretar como:

Receita
R$ 3.500,00
Categoria: Salário

Criar a interface preparada para futuramente utilizar inteligência artificial para categorização automática.

💰 LANÇAMENTOS

Criar uma página completa de lançamentos.

Tabela/lista contendo:

Data
Descrição
Categoria
Conta
Forma de pagamento
Valor
Status

Filtros:

Período

Categoria

Conta

Cartão

Tipo

Status

Pesquisa por texto.

Ordenação.

Paginação.

Permitir editar e excluir.

Criar agrupamento por data:

HOJE

Almoço
-R$ 35,00

Uber
-R$ 18,50

ONTEM

Mercado
-R$ 142,30

🏦 CONTAS

Criar gerenciamento de contas financeiras.

Exemplos:

Conta corrente

Conta poupança

Dinheiro físico

Conta digital

Carteira

Cada conta deve mostrar:

Nome
Instituição
Saldo
Última movimentação

Ao entrar na conta:

Saldo atual

Entradas

Saídas

Histórico

Gráfico de evolução

Permitir:

Adicionar conta
Editar conta
Excluir conta
Transferir dinheiro entre contas

💳 CARTÕES

Criar gerenciamento completo de cartões.

Cada cartão deve possuir:

Nome

Banco

Bandeira

Limite

Limite disponível

Dia de fechamento

Dia de vencimento

Cor personalizada

Criar visual de cartão de crédito moderno.

Página da fatura:

Fatura atual
Data de fechamento
Data de vencimento
Limite disponível

Lista de compras.

Suporte a:

Compras parceladas

Compras recorrentes

Estorno

Pagamento de fatura

📅 CONTAS RECORRENTES

Criar módulo para despesas recorrentes.

Exemplos:

Netflix
Spotify
Internet
Academia
Aluguel
Celular

Configurações:

Valor
Periodicidade
Data de cobrança
Categoria
Conta/cartão

Periodicidades:

Mensal

Semanal

Anual

Personalizada

Mostrar calendário financeiro.

📊 ORÇAMENTOS

Criar sistema de orçamento por categoria.

Exemplo:

Alimentação
Limite: R$ 800
Gasto: R$ 620
Restante: R$ 180

Criar barra de progresso.

Estados:

Normal
Atenção
Estourado

Permitir definir orçamento mensal por categoria.

🎯 METAS FINANCEIRAS

Criar sistema de metas.

Cada meta deve possuir:

Nome
Valor objetivo
Valor atual
Prazo
Categoria
Descrição

Exemplos:

Reserva de emergência
Comprar carro
Viagem
Computador
Investimentos

Mostrar:

Progresso
Percentual
Valor restante
Prazo restante

Criar gráficos de evolução.

📈 INVESTIMENTOS

Criar módulo de investimentos.

Permitir cadastrar:

Ações

FIIs

ETFs

Criptomoedas

Renda fixa

Tesouro

CDB

Outros

Mostrar:

Valor investido
Valor atual
Rentabilidade
Lucro/prejuízo
Percentual da carteira

Criar gráfico de distribuição da carteira.

Exemplo:

Renda fixa — 45%
Ações — 25%
FIIs — 20%
Cripto — 10%

Estruturar o sistema para futuramente integrar APIs de cotação.

💸 DÍVIDAS

Criar módulo de controle de dívidas.

Campos:

Credor
Valor original
Valor atual
Quantidade de parcelas
Parcelas pagas
Parcelas restantes
Juros
Vencimento

Mostrar:

Total de dívidas
Total já pago
Total restante

Criar timeline de pagamento.

💎 PATRIMÔNIO

Criar uma página para visualizar patrimônio líquido.

Ativos:

Dinheiro

Contas bancárias

Investimentos

Veículos

Imóveis

Outros bens

Passivos:

Cartões

Empréstimos

Financiamentos

Dívidas

Calcular:

Patrimônio líquido = Ativos - Passivos

Criar gráfico de evolução patrimonial ao longo dos meses.

📊 RELATÓRIOS

Criar área de relatórios financeiros.

Relatórios:

Receitas por período

Despesas por período

Despesas por categoria

Evolução patrimonial

Fluxo de caixa

Gastos com cartão

Gastos recorrentes

Investimentos

Dívidas

Filtros:

7 dias

30 dias

3 meses

6 meses

1 ano

Personalizado

Permitir exportar:

CSV

PDF

🔔 ALERTAS E NOTIFICAÇÕES

Criar sistema de notificações.

Exemplos:

"⚠️ Sua fatura está 82% utilizada."

"💰 Você gastou 15% menos que no mês passado."

"📅 Internet vence amanhã."

"🎯 Você atingiu 70% da sua meta."

"🚨 Seu orçamento de alimentação está quase no limite."

🔎 BUSCA GLOBAL

Criar busca global acessível pelo teclado.

Atalho:

Ctrl + K

Permitir pesquisar:

Lançamentos

Contas

Cartões

Metas

Categorias

Criar Command Menu moderno.

⌨️ ATALHOS

Criar atalhos de teclado.

Exemplo:

Ctrl + K → Busca

N → Novo lançamento

D → Nova despesa

R → Nova receita

Esc → Fechar modal

⚙️ CONFIGURAÇÕES

Criar configurações para:

Perfil
Preferências
Categorias
Contas
Notificações
Tema
Moeda
Formato de data
Segurança

Moeda padrão:

BRL — R$

Formato:

DD/MM/YYYY

🔐 AUTENTICAÇÃO

Criar estrutura de autenticação moderna.

Tela de login:

Email
Senha

Opções:

Entrar
Criar conta
Esqueci minha senha

Preparar estrutura para:

Google Login

Email/Senha

OAuth

Após login, direcionar para Dashboard.

📱 RESPONSIVIDADE

O sistema precisa funcionar perfeitamente no:

Desktop

Notebook

Tablet

Smartphone

No celular:

Bottom navigation

Cards adaptáveis

Gráficos responsivos

Tabelas transformadas em cards/listas

Botão flutuante "+"

Priorizar experiência mobile.

🧠 EXPERIÊNCIA DO USUÁRIO

Quero uma experiência extremamente fluida.

Evitar formulários gigantes.

Utilizar:

Autocomplete

Selects pesquisáveis

Valores pré-preenchidos

Última categoria utilizada

Última conta utilizada

Data atual automaticamente

Máscara de moeda brasileira

Feedback visual imediato

Exemplo:

Ao cadastrar:

"Uber R$ 23"

O sistema deve deixar o usuário escolher rapidamente a categoria e salvar.

📌 DASHBOARD PERSONALIZÁVEL

Permitir futuramente que o usuário escolha quais widgets aparecem no Dashboard.

Widgets:

Saldo

Receitas

Despesas

Fluxo de caixa

Categorias

Cartões

Metas

Investimentos

Contas futuras

Patrimônio

🗃️ DADOS DE DEMONSTRAÇÃO

Não deixar a aplicação vazia ao iniciar o protótipo.

Criar dados fictícios realistas para demonstrar o funcionamento.

Exemplo:

Receitas:

Salário — R$ 3.500
Freelance — R$ 800

Despesas:

Alimentação — R$ 650
Transporte — R$ 300
Lazer — R$ 250
Assinaturas — R$ 120

Contas:

Nubank
Inter
Carteira

Cartões:

Nubank
Inter

Metas:

Reserva de emergência
Viagem

✨ MICROINTERAÇÕES

Adicionar animações sutis:

Hover nos cards

Transição de páginas

Modal com animação

Barras de progresso animadas

Gráficos aparecendo suavemente

Toast após ações

Skeleton durante carregamento

Não exagerar nas animações.

A prioridade é velocidade e sensação de qualidade.

🧩 COMPONENTIZAÇÃO

Criar componentes reutilizáveis:

Button
Card
Modal
Input
CurrencyInput
DatePicker
Select
Dropdown
Badge
Toast
Tooltip
Chart
TransactionItem
AccountCard
CreditCard
GoalCard
BudgetCard
StatCard

Organizar o projeto em uma estrutura profissional.

🚨 ESTADOS DA APLICAÇÃO

Criar estados para:

Loading

Empty

Error

Success

Exemplo de Empty State:

"Você ainda não possui lançamentos."

Botão:

"+ Adicionar lançamento"

🎯 PRINCIPAL PRIORIDADE

A aplicação deve parecer um produto financeiro real e pronto para produção, não um projeto acadêmico.

Prioridades:

UX extremamente simples

Visual premium

Cadastro rápido

Dashboard poderoso

Responsividade

Organização do código

Escalabilidade

Clareza das informações

Gráficos e indicadores

Facilidade para o usuário entender sua situação financeira

Não criar todas as funcionalidades em uma única tela.

Utilizar navegação clara e hierarquia visual.

O resultado final deve transmitir a sensação de:

"Eu abro esse sistema e consigo entender minha vida financeira em poucos segundos."

Comece criando a estrutura completa da aplicação, o layout, navegação, Dashboard e as principais telas com dados mockados realistas. Deixe a arquitetura preparada para posteriormente conectar um banco de dados e autenticação real.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/25ae7345-2ed5-48d9-aa1d-d001f0fd0e23).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
