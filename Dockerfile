# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copia a solu��o e restaura as depend�ncias
COPY CadastroAlunosApi/CRUDAlunoApi.sln ./
COPY CadastroAlunosApi/Application/*.csproj ./Application/
COPY CadastroAlunosApi/Domain/*.csproj ./Domain/
COPY CadastroAlunosApi/Infra/*.csproj ./Infra/
COPY CadastroAlunosApi/Presentation/Presentation.csproj ./Presentation/

# Restaura as depend�ncias
RUN dotnet restore ./Presentation/Presentation.csproj

# Copia todos os arquivos e publica a aplica��o
COPY CadastroAlunosApi/ ./
WORKDIR /app/Presentation
RUN dotnet publish -c Release -o out

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build-env /app/Presentation/out .

# Exposi��o da porta
EXPOSE 80

# Configura o entrypoint para iniciar a aplica��o
ENTRYPOINT ["dotnet", "Presentation.dll"]