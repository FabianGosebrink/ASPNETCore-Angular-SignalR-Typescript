using System;

namespace AspNetCoreAngularSignalR.Dtos
{
    public class FoodItemDto
    {
        public int Id { get; set; }
        public string ItemName { get; set; }
        public DateTime Created { get; set; }
    }
}
