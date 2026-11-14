# 🛡️ Adventure Keeper — Module Template (Starter Kit)

> Repositório template oficial para criação de módulos declarativos e extensões de sistema para o [Adventure Keeper](https://adventurekeeper.com.br).

[![Validate Module](https://github.com/brunohonda/adventure-keeper-module-template/actions/workflows/validate.yml/badge.svg)](https://github.com/brunohonda/adventure-keeper-module-template/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/Docs-developers.adventurekeeper.com.br-d4af37)](https://developers.adventurekeeper.com.br)

---

## 📖 Visão Geral

Este repositório é o ponto de partida recomendado para desenvolvedores e criadores de conteúdo que desejam estender o **Adventure Keeper** com:

- Novos blocos mecânicos de fichas de personagens (ex: D&D 5e, Pathfinder 2e, Tormenta20, Call of Cthulhu).
- Configurações e regras específicas acopladas à campanha.
- Dicionários multilíngues (`pt-BR` e `en`) com fallback determinístico.

Para a documentação completa da especificação técnica, visite o [Portal de Desenvolvedores](https://developers.adventurekeeper.com.br).

---

## 📁 Estrutura do Projeto

```
adventure-keeper-module-template/
├── .github/
│   └── workflows/
│       └── validate.yml       # Validação automatizada em CI (GitHub Actions)
├── locales/
│   ├── pt-BR.json             # Catálogo de strings em Português (padrão)
│   └── en.json                # Catálogo de strings em Inglês
├── schemas/
│   ├── character-extension.json  # JSON Schema para dados adicionais de personagens
│   └── campaign-extension.json   # JSON Schema para dados adicionais de campanhas
├── tests/
│   └── schema.spec.ts         # Testes automatizados com Vitest e Ajv
├── scripts/
│   └── validate-manifest.mjs  # Linter do manifesto module.json
├── module.json                # Manifesto oficial do módulo
├── package.json               # Dependências e scripts de desenvolvimento
├── tsconfig.json              # Configurações TypeScript
└── vitest.config.ts           # Configurações de testes
```

---

## 🚀 Como Começar

### 1. Criar seu repositório a partir deste template

Clique no botão verde **"Use this template"** no topo da página no GitHub ou clone diretamente:

```bash
git clone https://github.com/brunohonda/adventure-keeper-module-template.git meu-modulo
cd meu-modulo
yarn install
```

### 2. Customizar o Manifesto (`module.json`)

Abra o arquivo `module.json` e configure:

- **`id`**: Escolha um identificador único com namespace (ex: `community.meu-sistema` ou `editora.nome-modulo`).
- **`name`**: Nome de exibição amigável.
- **`version`**: Versão inicial (ex: `1.0.0`).
- **`author`**: Seus dados ou da sua equipe.

### 3. Definir seus Schemas JSON

Edite ou crie novos schemas declarativos em `schemas/`:

- Utilize JSON Schema Draft-07 ou Draft 2020-12.
- Defina sempre `"additionalProperties": false` para evitar campos não controlados.
- Use chaves de internacionalização no atributo `"title"` (ex: `"starter.fields.heroPoints"`).

### 4. Cadastrar as Traduções

Adicione os textos em `locales/pt-BR.json` e `locales/en.json`.

---

## 🧪 Testes e Validação

Execute os scripts de validação antes de submeter seu módulo:

```bash
# Executar a suíte de testes unitários de schema
yarn test

# Validar a integridade estrutural do module.json
yarn validate

# Verificar formatação de código
yarn lint
```

---

## 🔒 Princípios de Segurança e Governança

- **Segurança Declarativa**: O Adventure Keeper **não executa scripts arbitrários** (JavaScript/Wasm) enviados por módulos externos. Toda extensão é 100% declarativa via JSON Schema.
- **Isolamento de Dados**: Dados de módulos são gravados exclusivamente nas tabelas `entity_module_data` e `campaign_module_data`, isolados por chave primária composta pelo `module_id`. O núcleo do Adventure Keeper permanece intocado.
- **Homologação**: Para publicar no diretório oficial, abra uma issue de submissão seguindo as [Diretrizes de Governança](https://developers.adventurekeeper.com.br/governance/submission).

---

## 📄 Licença

Este projeto é distribuído sob a licença [MIT](./LICENSE).
