using Cityvizor.Importer.Writer.Dtos;
using System.Text.Json;

namespace Cityvizor.Importer.Writer.Services;
public class FileSystemService
{
    internal TMetadataDto ReadMetadateJsonFile<TMetadataDto>(string filePath)
        where TMetadataDto : ImportMetadataDto
    {
        string fileContent = File.ReadAllText(filePath);
        TMetadataDto dto = JsonSerializer.Deserialize<TMetadataDto>(fileContent) 
            ?? throw new JsonException($"JsonSerializer.Deserialize returned null for input {fileContent}");
        return dto;
    }
}
