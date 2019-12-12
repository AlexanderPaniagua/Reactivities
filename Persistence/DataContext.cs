using Domain;
using Microsoft.EntityFrameworkCore;
using System;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DbSet<Value> Values { get; set; }

        public DataContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder) {
            builder.Entity<Value>().HasData(
                new Value { ID = 1, Name = "Value 1" },
                new Value { ID = 2, Name = "Value 2" },
                new Value { ID = 3, Name = "Value 3" }
                );
        }
    }
}
