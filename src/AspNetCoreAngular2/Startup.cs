using ASPNETCoreAngular2Demo.Hubs;
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
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseCors(config =>
                 config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseSignalR(routes =>
            {
                routes.MapHub<CoolMessagesHub>("coolmessages");
            });
            app.UseMvc();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            // Setup options with DI
            services.AddOptions();

            services.AddSingleton<IFoodRepository, FoodRepository>();
            services.AddScoped<ITimerService, TimerService>();
            services.Configure<TimerServiceConfiguration>(Configuration.GetSection("TimeService"));

            services.AddSignalR();

            AutoMapper.Mapper.Initialize(mapper =>
            {
                mapper.CreateMap<FoodItem, FoodItemDto>().ReverseMap();
            });

            services.AddMvc();
        }
    }
}
