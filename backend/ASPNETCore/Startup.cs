using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ASPNETCore.Repositories;
using AspNetCoreAngularSignalR.Repositories;
using AspNetCoreAngularSignalR.Models;
using AspNetCoreAngularSignalR.Dtos;
using AspNetCoreAngularSignalR.Services;
using Microsoft.Extensions.Hosting;
using AspNetCoreAngularSignalR.Hubs;
using ASPNETCore.Extensions;

namespace ASPNETCore
{
    public class Startup
    {
        readonly string CorsPolicy = "CorsPolicy";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(CorsPolicy,
                    builder =>
                    {
                        builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials();
                    });
            });

            services.AddSingleton<IFoodRepository, FoodRepository>();
            services.Configure<TimerServiceConfiguration>(Configuration.GetSection("TimeService"));
            services.AddSingleton<IHostedService, SchedulerHostedService>();

            services.AddSignalR();

            services.AddMappingProfiles();

            services.AddDbContext<FoodDbContext>(opt => opt.UseInMemoryDatabase("FoodDb"));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, Microsoft.AspNetCore.Hosting.IHostingEnvironment env)
        {
            app.UseCors(CorsPolicy);
            app.UseDefaultFiles();
            app.UseStaticFiles();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseSignalR(routes =>
            {
                routes.MapHub<CoolMessagesHub>("/coolmessages");
            });
            app.UseMvc();
        }
    }
}
