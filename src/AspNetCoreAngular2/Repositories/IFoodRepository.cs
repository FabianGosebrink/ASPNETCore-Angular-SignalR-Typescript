using System.Collections.Generic;
using AspNetCoreAngular2.Models;

namespace AspNetCoreAngular2.Repositories
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
