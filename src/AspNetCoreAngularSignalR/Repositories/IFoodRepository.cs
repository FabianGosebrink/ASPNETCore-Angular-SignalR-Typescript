using System.Collections.Generic;
using AspNetCoreAngularSignalR.Models;

namespace AspNetCoreAngularSignalR.Repositories
{
    public interface IFoodRepository
    {
        List<FoodItem> GetAll();
        FoodItem GetSingle(int id);
        FoodItem Add(FoodItem toAdd);
        FoodItem Update(FoodItem toUpdate);
        void Delete(int id);
    }
}
