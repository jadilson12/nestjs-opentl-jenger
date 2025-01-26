# Use a imagem oficial do Node.js
FROM node:22

# Configure o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos necessários para o contêiner
COPY package.json package-lock.json ./ 

# Instale as dependências
# RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta usada pelo servidor
EXPOSE 3000

# Comando padrão para iniciar o servidor
CMD ["npm", "run", "start:dev"]
