using ASPNETCore.Web.MappingProfiles;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;

namespace ASPNETCore.Extensions
{
    public static class MappingExtensions
    {
        public static void AddMappingProfiles(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(FoodMappings));
        }
    }
}
