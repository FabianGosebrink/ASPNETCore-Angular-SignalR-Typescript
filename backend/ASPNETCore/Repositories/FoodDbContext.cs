using Microsoft.EntityFrameworkCore;

namespace ASPNETCore.Repositories
{
    public class FoodDbContext : DbContext
    {
        public FoodDbContext(DbContextOptions<FoodDbContext> options)
            : base(options)
        {
        }

        public DbSet<FoodDbContext> TodoItems { get; set; }
    }
}
