using Cityvizor.Importer.Domain.Abstractions.Repositories;

namespace Cityvizor.Importer.Infrastructure.Repositories;

internal class Repository<TEntity>(CityvizorDbContext context) : IRepository<TEntity>
    where TEntity : class
{
    private readonly CityvizorDbContext _context = context;

    public IQueryable<TEntity> Query => _context.Set<TEntity>().AsQueryable();

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
}
