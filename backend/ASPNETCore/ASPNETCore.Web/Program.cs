using ASPNETCore.Extensions;
using ASPNETCore.Repositories;
using ASPNETCore.Web;
using ASPNETCore.Web.MappingProfiles;
using AspNetCoreAngularSignalR.Hubs;
using AspNetCoreAngularSignalR.Repositories;
using AspNetCoreAngularSignalR.Services;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
                .AddNewtonsoftJson(options =>
                       options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder =>
        {
            builder
                .AllowAnyHeader()
                .AllowAnyMethod()
                .WithOrigins("http://localhost:4200")
            .AllowCredentials();
        });
});

builder.Services.AddSingleton<IFoodRepository, FoodRepository>();
builder.Services.Configure<TimerServiceConfiguration>(builder.Configuration.GetSection("TimeService"));
builder.Services.AddSingleton<IHostedService, SchedulerHostedService>();

builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddSignalR();

builder.Services.AddMappingProfiles();

builder.Services.AddDbContext<FoodDbContext>(opt => opt.UseInMemoryDatabase("FoodDb"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
var loggerFactory = app.Services.GetRequiredService<ILoggerFactory>();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

app.MapControllers();
app.MapHub<ChatHub>("/coolmessages");

app.Run();