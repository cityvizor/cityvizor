using Cityvizor.Importer.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Cityvizor.Importer.Extensions;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Cityvizor.Importer.UnitTests")]

public class Program
{
    static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddDbContext<CityvizorDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("PosgreSql"))
            .UseSnakeCaseNamingConvention());

        builder.Services.RegisterImporterBackgroundService(builder.Configuration);
        builder.Services.RegisterKxxConverter();
        builder.Services.AddLogging();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        //app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}


