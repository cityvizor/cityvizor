namespace Cityvizor.Importer.Domain.Abstractions.Repositories;

public interface IRepository<TEntity> where TEntity : class
{
    IQueryable<TEntity> Query { get; }

    Task<int> SaveChangesAsync();
}
