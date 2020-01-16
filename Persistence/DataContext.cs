using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }

        public DataContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder) {
            base.OnModelCreating(builder);
            builder.Entity<Value>().HasData(
                new Value { ID = 1, Name = "Value 1" },
                new Value { ID = 2, Name = "Value 2" },
                new Value { ID = 3, Name = "Value 3" }
                );
        }
    }
}
