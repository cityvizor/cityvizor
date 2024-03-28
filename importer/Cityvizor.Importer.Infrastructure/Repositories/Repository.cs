using Cityvizor.Importer.Domain.Abstractions.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Cityvizor.Importer.Infrastructure.Repositories;
internal class Repository<TEntity> : IRepository<TEntity>
    where TEntity : class
{
    private readonly CityvizorDbContext _context;

    public Repository(CityvizorDbContext context)
    {
        this._context = context;
    }

    public IQueryable<TEntity> Query => _context.Set<TEntity>().AsQueryable();

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
}
