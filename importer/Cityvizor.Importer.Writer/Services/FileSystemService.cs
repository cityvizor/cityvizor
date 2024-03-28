using Cityvizor.Importer.Writer.Dtos;
using CsvHelper;
using System.Globalization;
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

    internal async Task WriteToCsvAsync<TDto>(IEnumerable<TDto> dtos, string filePath)
    {
        using (StreamWriter streamWriter = new(filePath))
        using (CsvWriter csvWriter = new (streamWriter, CultureInfo.InvariantCulture)) // TODO: will existing .js importer be able to read the data written with this culture? 
        {
            await csvWriter.WriteRecordsAsync(dtos);
        }
    }

}
