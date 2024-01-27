using Cityvizor.Importer.Options;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace Cityvizor.Importer.Validators;

public sealed class BackgroundServicesOptionsValidator : IValidateOptions<BackgroundServicesOptions>
{
    public ValidateOptionsResult Validate(string? name, BackgroundServicesOptions options)
    {
        var validator = new InlineValidator<BackgroundServicesOptions>();
        validator.RuleFor(_ => _.ImporterServiceFrequency).GreaterThan(TimeSpan.Zero);
        var result = validator.Validate(options);
        if (result.IsValid)
            return ValidateOptionsResult.Success;
        else
            return ValidateOptionsResult.Fail(result.Errors.Select(_ => _.ErrorMessage));
    }
}
