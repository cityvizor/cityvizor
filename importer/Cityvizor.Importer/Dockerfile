#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Cityvizor.Importer/Cityvizor.Importer.csproj", "Cityvizor.Importer/"]
COPY ["Cityvizor.Importer.Converter/Cityvizor.Importer.Converter.csproj", "Cityvizor.Importer.Converter/"]
COPY ["Cityvizor.Importer.Domain/Cityvizor.Importer.Domain.csproj", "Cityvizor.Importer.Domain/"]
COPY ["Cityvizor.Importer.Writer/Cityvizor.Importer.Writer.csproj", "Cityvizor.Importer.Writer/"]
COPY ["Cityvizor.Importer.Infrastructure/Cityvizor.Importer.Infrastructure.csproj", "Cityvizor.Importer.Infrastructure/"]
RUN dotnet restore "./Cityvizor.Importer/./Cityvizor.Importer.csproj"
COPY . .
WORKDIR "/src/Cityvizor.Importer"
RUN dotnet build "./Cityvizor.Importer.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Cityvizor.Importer.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Cityvizor.Importer.dll"]