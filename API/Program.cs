using System;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using Persistence;

namespace API
{
    public class Program
    {
        private static NLog.Logger logger1 = NLog.LogManager.GetCurrentClassLogger();
        public static async Task Main(string[] args)
        {
            logger1.Info("Main step: {0}", "1");
            //CreateHostBuilder(args).Build().Run();
            var host = CreateHostBuilder(args).Build();
            using (var scope = host.Services.CreateScope()) {
                var services = scope.ServiceProvider;
                try {
                    var context = services.GetRequiredService<DataContext>();
                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    context.Database.Migrate();
                    Seed.SeedData(context, userManager).Wait();
                }
                catch (Exception ex) {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error ocurred during migration");
                }
            }
            logger1.Info("Main step: {0}", "7");
            host.Run();


            /*//https://andrewlock.net/running-async-tasks-on-app-startup-in-asp-net-core-part-1/
            IWebHost webHost = CreateWebHostBuilder(args).Build();

            // Create a new scope
            using (var scope = webHost.Services.CreateScope())
            {
                // Get the DbContext instance
                var myDbContext = scope.ServiceProvider.GetRequiredService<DataContext>();

                //Do the migration asynchronously
                await myDbContext.Database.MigrateAsync();
            }

            // Run the WebHost, and start accepting requests
            // There's an async overload, so we may as well use it
            await webHost.RunAsync();*/
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        //Missing method
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) => WebHost.CreateDefaultBuilder(args).UseStartup<Startup>();
    }
}
