# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copia a solução e restaura as dependências
COPY CadastroAlunosApi/CRUDAlunoApi.sln ./
COPY CadastroAlunosApi/Application/*.csproj ./Application/
COPY CadastroAlunosApi/Domain/*.csproj ./Domain/
COPY CadastroAlunosApi/Infra/*.csproj ./Infra/
COPY CadastroAlunosApi/Presentation/Presentation.csproj ./Presentation/

# Restaura as dependências
RUN dotnet restore ./Presentation/Presentation.csproj

# Copia todos os arquivos e publica a aplicação
COPY CadastroAlunosApi/ ./
WORKDIR /app/Presentation
RUN dotnet publish -c Release -o out

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build-env /app/Presentation/out .

# Exposição da porta
EXPOSE 80

# Configura o entrypoint para iniciar a aplicação
ENTRYPOINT ["dotnet", "Presentation.dll"]