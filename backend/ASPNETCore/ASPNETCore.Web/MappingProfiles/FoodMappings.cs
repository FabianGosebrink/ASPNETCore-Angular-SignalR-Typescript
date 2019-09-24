using AspNetCoreAngularSignalR.Dtos;
using AspNetCoreAngularSignalR.Models;
using AutoMapper;

namespace ASPNETCore.Web.MappingProfiles
{
    public class FoodMappings : Profile
    {
        public FoodMappings()
        {
            CreateMap<FoodItem, FoodItemDto>().ReverseMap();
        }
    }
}
