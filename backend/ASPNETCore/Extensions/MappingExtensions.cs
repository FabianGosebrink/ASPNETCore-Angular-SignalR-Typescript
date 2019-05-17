using AspNetCoreAngularSignalR.Dtos;
using AspNetCoreAngularSignalR.Models;
using Microsoft.Extensions.DependencyInjection;

namespace ASPNETCore.Extensions
{
    public static class MappingExtensions
    {
        public static void AddMappingProfiles(this IServiceCollection services)
        {
            AutoMapper.Mapper.Initialize(mapper =>
            {
                mapper.CreateMap<FoodItem, FoodItemDto>().ReverseMap();
            });
        }
    }
}
