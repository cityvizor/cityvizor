using Microsoft.EntityFrameworkCore;
using Cityvizor.Importer.Extensions;
using System.Runtime.CompilerServices;
using Serilog;
using Serilog.Templates;
using Cityvizor.Importer.Domain.Extensions;
using Cityvizor.Importer.Infrastructure;
using Cityvizor.Importer.Infrastructure.Extensions;
using Cityvizor.Importer.Writer.Extensions;

[assembly: InternalsVisibleTo("Cityvizor.Importer.UnitTests")]

public class Program
{
    static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Host.UseSerilog((ctx, lc) => lc
            .WriteTo.Console(new ExpressionTemplate(
                $"[{{@t:HH:mm:ss}} {{@l:u3}}] {{#if {LoggingExtensions.ImportId} is not null}} (Import {{{LoggingExtensions.ImportId}}}){{#end}} {{@m}}\n"))
            .WriteTo.Map(LoggingExtensions.ImportLogFile, (path, wt) => wt.File(path), sinkMapCountLimit: 20)
        );

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddDbContext<CityvizorDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("PosgreSql"))
            .UseSnakeCaseNamingConvention());
        builder.Services.RegisterRepositoriesScoped();

        builder.Services.RegisterImporterBackgroundService(builder.Configuration);
        builder.Services.RegisterImportServices();
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


