using Cityvizor.Importer.Options;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace Cityvizor.Importer.Validators;
    
public sealed class ImporterServiceOptionsValidator : IValidateOptions<ImporterServiceOptions>
{
    public ValidateOptionsResult Validate(string? name, ImporterServiceOptions options)
    {
        var validator = new InlineValidator<ImporterServiceOptions>();
        validator.RuleFor(_ => _.ServiceFrequency).GreaterThan(TimeSpan.Zero).When(_ => _.Enabled);
        var result = validator.Validate(options);
        if (result.IsValid)
            return ValidateOptionsResult.Success;
        else
            return ValidateOptionsResult.Fail(result.Errors.Select(_ => _.ErrorMessage));
    }
}
