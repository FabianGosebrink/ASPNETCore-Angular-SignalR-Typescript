using ASPNETCoreAngular2Demo.Models;
using ASPNETCoreAngular2Demo.Repositories;
using ASPNETCoreAngular2Demo.Services;
using ASPNETCoreAngular2Demo.ViewModels;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ASPNETCoreAngular2Demo
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; }


        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseCors("AllowAllOrigins");

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseWebSockets();
            app.UseSignalR();

            app.UseMvc();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                    });
            });

            // Setup options with DI
            services.AddOptions();

            services.AddSingleton<IFoodRepository, FoodRepository>();
            services.AddSingleton<ITimerService, TimerService>();
            services.Configure<TimerServiceConfiguration>(Configuration.GetSection("TimeService"));

            services.AddSignalR(options =>
            {
                options.Hubs.EnableDetailedErrors = true;
            });

            AutoMapper.Mapper.Initialize(mapper =>
            {
                mapper.CreateMap<FoodItem, FoodItemViewModel>().ReverseMap();
            });

            services.AddMvc();
        }
    }
}
