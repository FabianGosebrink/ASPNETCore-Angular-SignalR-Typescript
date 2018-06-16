using AspNetCoreAngularSignalR.Dtos;
using AspNetCoreAngularSignalR.Hubs;
using AspNetCoreAngularSignalR.Models;
using AspNetCoreAngularSignalR.Repositories;
using AspNetCoreAngularSignalR.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AspNetCoreAngularSignalR
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
                 config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials());

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseHttpsRedirection();
            app.UseSignalR(routes =>
            {
                routes.MapHub<CoolMessagesHub>("/coolmessages");
            });
            app.UseMvc();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            // Setup options with DI
            services.AddOptions();

            services.AddSingleton<IFoodRepository, FoodRepository>();
            services.Configure<TimerServiceConfiguration>(Configuration.GetSection("TimeService"));
            services.AddSingleton<IHostedService, SchedulerHostedService>();

            services.AddSignalR();

            AutoMapper.Mapper.Initialize(mapper =>
            {
                mapper.CreateMap<FoodItem, FoodItemDto>().ReverseMap();
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }
    }
}
