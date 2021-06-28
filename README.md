# Carteirinha

Aplicação para controle de despesas (em construção)

## Dependências

- Redis
- Mysql
- Node.js

## Rodando o back-end localmente

1) Instale o Redis (redis-cli), Node.js e o Mysql

2) Crie o banco de dados
```mysql> create database carteirinha;```

3) Rode o migrations para criar os schemas e tabelas
```npx sequelize db:migrate```

Para o rollback, execute
```npx sequelize db:migrate:undo```

4) Inicie o back-end
```npm start```

Após executar o projeto, acesse ```localhost:9000/api-docs``` para visualizar a documentação.


## Rodando o front-end

O front-end ainda está em desenvolvimento :)
